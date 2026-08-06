const SUPABASE_URL = "https://eazcxqarrcosjywrdcjk.supabase.co";
const SUPABASE_KEY = "sb_publishable_FdG9XQDEkcO-D5ebncJ4mg_YTedGq_Z";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


let aktuellerArtikel = null;


// Artikel suchen
async function suchen(){

    let barcode = document.getElementById("barcode").value;

    let { data, error } = await supabaseClient
        .from("Artikel")
        .select("*")
        .eq("barcode", barcode)
        .single();


    if(error){
        console.log(error);
        alert("Artikel nicht gefunden");
        return;
    }


    aktuellerArtikel = data;


    document.getElementById("artikel").innerHTML =
        data.name;

    document.getElementById("bestand").innerHTML =
        data.bestand;
}



// Bestand ändern
async function bestandAendern(menge){

    if(!aktuellerArtikel){
        alert("Bitte zuerst Artikel suchen!");
        return;
    }


    let neuerBestand = aktuellerArtikel.bestand + menge;


    if(neuerBestand < 0){
        alert("Nicht genug Bestand!");
        return;
    }


    let { error } = await supabaseClient
        .from("Artikel")
        .update({
            bestand: neuerBestand
        })
        .eq("id", aktuellerArtikel.id);


    if(error){
        console.log(error);
        alert("Fehler beim Speichern");
        return;
    }


    aktuellerArtikel.bestand = neuerBestand;


    document.getElementById("bestand").innerHTML =
        neuerBestand;


    console.log("Neuer Bestand:", neuerBestand);
}



// IN +
function eingang(){

    let menge = Number(
        document.getElementById("menge").value
    );


    if(!menge){
        alert("Menge eingeben!");
        return;
    }


    bestandAendern(menge);
}



// OUT -
function ausgang(){

    let menge = Number(
        document.getElementById("menge").value
    );


    if(!menge){
        alert("Menge eingeben!");
        return;
    }


    bestandAendern(-menge);
}