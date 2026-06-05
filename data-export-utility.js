import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import * as XLSX from "xlsx";
import * as fs from "fs";

// 1. YOUR FIREBASE KEYS (Get these from your project's existing firebase configuration file)
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY_HERE",
  authDomain: "academic-telemetry-hub.firebaseapp.com",
  projectId: "academic-telemetry-hub",
  storageBucket: "academic-telemetry-hub.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID_HERE",
  appId: "YOUR_APP_ID_HERE",
};

// 2. Initialize connection
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function runExport() {
  console.log("⏳ Connecting to Firebase 'quiz_attempts' collection...");
  try {
    const querySnapshot = await getDocs(collection(db, "quiz_attempts"));

    // 3. Map your fields exactly matching the database schema from your screenshot
    let rows = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        "Student UID": data.studentUid || "Anonymous Student",
        "Selected Option / SQL Query": data.finalSelectedOption || "N/A",
        "Confidence Rating": data.confidenceRating || 0,
        "Is Correct?": data.isCorrect ? "True" : "False",
        "Time Spent (sec)": data.timeSpent || 0,
        "Option Changes": data.optionChanges || 0,
        "Marked For Review": data.markedForReview ? "True" : "False",
        "Review Click Count": data.reviewClickCount || 0,
        Institution: data.institution || "N/A",
        "Student CGPA": data.studentCgpa || 0,
        "Firebase Document Reference ID": doc.id,
      };
    });

    if (rows.length === 0) {
      console.log("❌ No rows found in the collection database.");
      return;
    }

    // 4. Automatically group data so a single student's multiple questions sit together
    rows.sort((a, b) => a["Student UID"].localeCompare(b["Student UID"]));

    // 5. Convert matrix into standard Excel workbook layers
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Telemetry Data");

    // 6. Write file locally into your VS Code project file folder directory
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });
    fs.writeFileSync("Quiz_Attempts_Report.xlsx", excelBuffer);

    console.log(
      "\x1b[32m%s\x1b[0m",
      "\n✅ SUCCESS! 'Quiz_Attempts_Report.xlsx' has been created in your folder directory!\n",
    );
  } catch (error) {
    console.error("❌ Database download failed:", error);
  }
}

runExport();
