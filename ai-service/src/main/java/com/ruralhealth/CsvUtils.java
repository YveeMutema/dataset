package com.ruralhealth;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class CsvUtils {

    public static Path resolveDataPath(String... candidates) throws IOException {
        for (String candidate : candidates) {
            Path path = Path.of(candidate);
            if (Files.exists(path)) {
                return path;
            }
        }
        throw new IOException("Dataset file not found in any of: " + Arrays.toString(candidates));
    }

    public static File normalizeHeader(String csvPath) throws IOException {
        return normalizeHeader(Path.of(csvPath));
    }

    public static File normalizeHeader(Path csvPath) throws IOException {
        Path normalized = Path.of(csvPath.toString() + ".normalized.csv");
        try (BufferedReader reader = Files.newBufferedReader(csvPath);
             BufferedWriter writer = Files.newBufferedWriter(normalized)) {
            String header = reader.readLine();
            if (header == null) {
                throw new IOException("CSV file has no header: " + csvPath);
            }
            while (header.endsWith(",")) {
                header = header.substring(0, header.length() - 1);
            }

            String[] columns = header.split(",", -1);
            Map<String, Integer> count = new HashMap<>();
            for (int i = 0; i < columns.length; i++) {
                String name = columns[i];
                int seen = count.getOrDefault(name, 0);
                count.put(name, seen + 1);
                if (seen > 0) {
                    columns[i] = name + "_" + seen;
                }
            }

            writer.write(String.join(",", columns));
            writer.newLine();

            String line;
            while ((line = reader.readLine()) != null) {
                while (line.endsWith(",")) {
                    line = line.substring(0, line.length() - 1);
                }
                writer.write(line);
                writer.newLine();
            }
        }
        return normalized.toFile();
    }
}
