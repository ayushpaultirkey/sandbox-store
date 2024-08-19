function doGet(e) {

    // Get package sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Packages");
    const data = sheet.getDataRange().getValues();
  
    // Get header column
    const headers = data[0];
    const rows = data.slice(1);
  
    // Check for the "name" parameter
    if(!e.parameter.name) {

        // If no name parameter, return up to 10 random results
        const randomRows = shuffleArray(rows).slice(0, 10);
        
        // Prepare JSON response
        const jsonData = randomRows.map(row => {
            let obj = {};
            headers.forEach((header, i) => {
                obj[header] = row[i];
            });
            return obj;
        });
        
        return ContentService.createTextOutput(JSON.stringify(jsonData)).setMimeType(ContentService.MimeType.JSON);

    }
  
    // Prepare app name
    const queryName = e.parameter.name.toLowerCase();
  
    // Search for the app using name
    const filteredRows = rows.filter(row => {
        return row[headers.indexOf("name")].toLowerCase().includes(queryName);
    });
  
    // Prepare JSON response
    const jsonData = filteredRows.map(row => {
        let obj = {};
        headers.forEach((header, i) => {
            obj[header] = row[i];
        });
        return obj;
    });
  
    return ContentService.createTextOutput(JSON.stringify(jsonData)).setMimeType(ContentService.MimeType.JSON);
    
}

// Helper function to shuffle an array
function shuffleArray(array) {
    for(let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
