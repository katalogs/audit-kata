package audit;

import java.util.List;

interface IFileSystem {

    String[] getFiles(String directoryName);

    void writeAllText(String filePath, String content);

    List<String> readAllLines(String filePath);
}
