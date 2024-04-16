import { readFile, writeFile } from 'fs';

// Leer el archivo JSON
readFile('countries_states.json', (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }

    // Parsear el contenido del archivo a JSON
    const jsonData = JSON.parse(data);

    // Limpiar los datos
    const cleanedData = jsonData.map(item => ({
        name: item.name,
        iso3: item.iso3,
        iso2: item.iso2,
        currency: item.currency,
        currency_symbol: item.currency_symbol,
        latitude: item.latitude,
        longitude: item.longitude,
        emoji: item.emoji,
        name_es: item.translations.es,
        states: item.states.map(state => ({
            id: state.id,
            name: state.name,
            state_code: state.state_code,
            latitude: state.latitude,
            longitude: state.longitude
        }))
    }));

    // Convertir los datos limpios de nuevo a JSON
    const outputJson = JSON.stringify(cleanedData, null, 2);

    // Guardar los datos limpios en un nuevo archivo
    writeFile('countries_states_cleaned.json', outputJson, (err) => {
        if (err) {
            console.error("Error writing file:", err);
            return;
        }

        console.log('File has been saved successfully!');
    });
});
