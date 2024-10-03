import fs from "node:fs";
import { generateTimestamp } from "./generateTimestamp";
import { Record } from "../interfaces";

export async function generateRecord(record: Record) {
  record = {
    error: record.error || false,
    timestamp: generateTimestamp(),
    data: record.data || null,
  };

  createRecordInFile(record);
}

function createRecordInFile({ timestamp, error, data }: Record) {
  const pathFolder = `logs/logs.txt`;

  // Definir la estructura del log
  const logEntry = `[${timestamp}] - [error: ${error}] - [data: ${
    data ? JSON.stringify(data) : "null"
  }]\n`;

  try {
    if (!fs.existsSync(pathFolder)) {
      fs.mkdirSync(pathFolder.split("/")[0], { recursive: true });
      fs.writeFileSync(`${pathFolder}`, logEntry);
    } else {
      fs.appendFile(pathFolder, logEntry, (err) => {
        if (err) {
          throw new Error("Error al escribir en el archivo de log:", err);
        }
        console.log("Registro guardado correctamente");
      });
    }
  } catch (error) {
    console.log(
      "Ha ocurrido un error al generar el archivo de registros",
      error
    );
    return;
  }
}
