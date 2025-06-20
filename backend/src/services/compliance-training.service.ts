import { Request, Response } from "express";
import fs from "fs";
import path from "path";

// In-memory data store for demo
let trainingRecords: any[] = [];
let idCounter = 1;

export function getAllTrainingRecords(req: Request, res: Response) {
  // Add filtering/search logic here if needed
  res.json(trainingRecords);
}

export function createTrainingRecord(req: Request, res: Response) {
  const record = { id: idCounter++, ...req.body, proof: null };
  trainingRecords.push(record);
  res.status(201).json(record);
}

export function updateTrainingRecord(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  const idx = trainingRecords.findIndex((r) => r.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  trainingRecords[idx] = { ...trainingRecords[idx], ...req.body };
  res.json(trainingRecords[idx]);
}

export function deleteTrainingRecord(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  trainingRecords = trainingRecords.filter((r) => r.id !== id);
  res.status(204).send();
}

export function uploadProof(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  const idx = trainingRecords.findIndex((r) => r.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  trainingRecords[idx].proof = req.file.filename;
  res.json({ success: true, filename: req.file.filename });
}

export function exportTrainingCSV(req: Request, res: Response) {
  const header = "id,name,department,role,status,last,next,provider,proof\n";
  const rows = trainingRecords
    .map(
      (r) =>
        `${r.id},${r.name},${r.department},${r.role},${r.status},${r.last},${r.next},${r.provider},${r.proof || ""}`,
    )
    .join("\n");
  const csv = header + rows;
  res.header("Content-Type", "text/csv");
  res.attachment("training.csv");
  res.send(csv);
}
