## Audit Kata
If you like this Kata, you may be interested by the website [SammanCoaching.org](https://sammancoaching.org/).

### Kata Description
The problem that this code is designed to solve is explained here: [Audit](https://sammancoaching.org/kata_descriptions/audit.html).

The code is available in the `Audit` folder.

### The System
`AuditManager` is the main class in the application. 
Its constructor accepts the maximum number of entries per file and the working directory as configuration parameters. 

```c#
namespace Audit
{
    public class AuditManager
    {
        private readonly int _maxEntriesPerFile;
        private readonly string _directoryName;
        private readonly IFileSystem _fileSystem;

        public AuditManager(
            int maxEntriesPerFile, 
            string directoryName,
            IFileSystem fileSystem)
        {
            _maxEntriesPerFile = maxEntriesPerFile;
            _directoryName = directoryName;
            _fileSystem = fileSystem;
        }
    
        public void AddRecord(string visitorName, DateTime timeOfVisit)
        {
            string[] filePaths = _fileSystem.GetFiles(_directoryName);
            (int index, string path)[] sorted = SortByIndex(filePaths);
            var newRecord = visitorName + ';' + timeOfVisit.ToString("yyyy-MM-dd HH:mm:ss");
        
            if (sorted.Length == 0)
            {
                string newFile = Path.Combine(_directoryName, "audit_1.txt");
                _fileSystem.WriteAllText(newFile, newRecord);
            
                return;
            }
        
            (int currentFileIndex, string currentFilePath) = sorted.Last();
            List<string> lines = _fileSystem.ReadAllLines(currentFilePath).ToList();
        
            if (lines.Count < _maxEntriesPerFile)
            {
                lines.Add(newRecord);
                string newContent = string.Join(Environment.NewLine, lines);
                _fileSystem.WriteAllText(currentFilePath, newContent);
            }
            else
            {
                int newIndex = currentFileIndex + 1;
                string newName = $"audit_{newIndex}.txt";
                string newFile = Path.Combine(_directoryName, newName);
                _fileSystem.WriteAllText(newFile, newRecord);
            }
        }

        private static (int index, string path)[] SortByIndex(string[] filePaths)
            => filePaths
                .AsEnumerable()
                .Select((path, index) => (index + 1, path))
                .ToArray();
    }
}
```

The only public method in the class is `AddRecord`, which does all the work of the audit system:
- Retrieves a full list of files from the working directory
- Sorts them by index (all filenames follow the same pattern: `audit_{index}.txt` [for example, audit_1.txt])
- If there are no audit files yet, creates a first one with a single record
- If there are audit files, gets the most recent one and either appends the new record to it or creates a new file, depending on whether the number of entries in that file has reached the limit

### Learning hour
You can use this code to prepare / practice this learning hour: [Styles of Unit Tests](https://sammancoaching.org/learning_hours/test_design/styles_of_unit_tests.html).