import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import { addMedicalReportRecord, MedicalReportRecord } from "./firestore";

export const uploadPatientReport = async (
  patientId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<MedicalReportRecord> => {
  const fileExt = file.name.split(".").pop();
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const storagePath = `medicalReports/${patientId}/${timestamp}_${safeName}`;
  const storageRef = ref(storage, storagePath);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => {
        console.error("Storage upload error:", error);
        reject(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          const reportRecordData = {
            patientId,
            fileName: file.name,
            fileUrl: downloadUrl,
            fileType: file.type || "application/octet-stream",
            fileSize: file.size,
            status: "UPLOADED" as const,
          };
          const docId = await addMedicalReportRecord(reportRecordData);
          resolve({ id: docId, ...reportRecordData });
        } catch (dbErr) {
          reject(dbErr);
        }
      }
    );
  });
};
