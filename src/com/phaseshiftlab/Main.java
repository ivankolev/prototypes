package com.phaseshiftlab;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

public class Main {

    private ArrayList<HashMap<Integer, Boolean>> rowMaps = new ArrayList<>();
    private ArrayList<HashMap<Integer, Boolean>> columnMaps = new ArrayList<>();

    public static void main(String[] args) {
        try {
           runTests();
        } catch (IOException e) {
            System.out.println("Could not open file: ");
            e.printStackTrace();
        }
    }

    private static void runTests() throws IOException {
        Main app = new Main();

        List<Path> paths = new ArrayList<>();
        paths.add(Paths.get(Paths.get("").toAbsolutePath() + "/resources/input_sudoku.txt"));
        paths.add(Paths.get(Paths.get("").toAbsolutePath() + "/resources/valid_sudoku.txt"));
        paths.add(Paths.get(Paths.get("").toAbsolutePath() + "/resources/invalid_first_row_sudoku.txt"));
        paths.add(Paths.get(Paths.get("").toAbsolutePath() + "/resources/invalid_second_column_sudoku.txt"));
        paths.add(Paths.get(Paths.get("").toAbsolutePath() + "/resources/incomplete_sudoku.txt"));
        paths.add(Paths.get(Paths.get("").toAbsolutePath() + "/resources/no_such_file.txt"));
        for(Path path: paths) {
            app.initMaps();
            Boolean isSolution = app.isSudokuSolution(path);
            String result = isSolution ? "valid solution" : "invalid solution";
            System.out.println("Contents of " + path + " are " + result);
        }
    }

    private Boolean isSudokuSolution(Path path) throws IOException {
        Boolean result = true;
        final List<String> lines = Files.lines(path).collect(Collectors.toList());
        if(lines.size() != 9) {
            result = false;
        }

        for(int i = 0; i < lines.size(); i++) {
            String line = lines.get(i);
            if (line.length() != 9) {
                result = false;
            }
            System.out.println(line);
            HashMap<Integer, Boolean> row = rowMaps.get(i);

            for (int j = 0; j < line.length(); j++) {
                HashMap<Integer, Boolean> column = columnMaps.get(j);
                int c = Character.getNumericValue(line.charAt(j));
                if (column.containsKey(c)) {
                    result = false;
                } else {
                    column.put(c, true);
                }
                if(row.containsKey(c)) {
                    result = false;
                } else {
                    row.put(c, true);
                }
            }

            if(rowMaps.get(i).size() != 9) {
                result = false;
            }
        }
        return result;
    }

    private void initMaps() {
        this.rowMaps.clear();
        this.columnMaps.clear();
        for(int i = 0; i < 9; i++) {
            rowMaps.add(i, new HashMap<>());
            columnMaps.add(i, new HashMap<>());
        }
    }
}
