const SUPABASE_URL = "https://eazcxqarrcosjywrdcjk.supabase.co";
const SUPABASE_KEY = "sb_publishable_FdG9XQDEkcO-D5ebncJ4mg_YTedGq_Z";


const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


let aktuellerArtikel = null;
let scanner = null;



// Artikel suchen per Barcode
async function suchen(){

    let barcode = document.getElementById("barcode").value.trim();


    if(!barcode){
        return;
    }


    let { data, error } = await supabaseClient
        .from("Artikel")
        .select("*")
        .eq("barcode", barcode)
        .maybeSingle();



    if(error){

        console.log(error);
        return;

    }



    if(!data){

        aktuellerArtikel = null;

        document.getElementById("artikel").innerHTML =
            "❌ Kein Artikel gefunden";


        document.getElementById("bestand").innerHTML =
            "-";


        document.getElementById("neuerArtikelBox").style.display =
            "block";


        document.getElementById("neuBarcode").value =
            barcode;


        return;

    }


    anzeigen(data);

}




// Artikel anzeigen

function anzeigen(data){

    aktuellerArtikel = data;


    document.getElementById("artikel").innerHTML =
        "✅ " + data.name;


    document.getElementById("bestand").innerHTML =
        data.bestand;


    document.getElementById("neuerArtikelBox").style.display =
        "none";

}





// Suche nach Name oder ID

async function sucheNameID(){

    let suche =
        document.getElementById("nameSuche").value.trim();



    let { data, error } = await supabaseClient
        .from("Artikel")
        .select("*")
        .or(`name.ilike.%${suche}%,id.eq.${suche}`)
        .limit(1)
        .maybeSingle();



    if(error){

        console.log(error);
        return;

    }



    if(data){

        anzeigen(data);

    }else{

        document.getElementById("artikel").innerHTML =
            "❌ Kein Artikel gefunden";

    }

}




// Bestand ändern

async function bestandAendern(aenderung){


    if(!aktuellerArtikel){

        alert("Erst Artikel suchen!");

        return;

    }



    let neuerBestand =
        aktuellerArtikel.bestand + aenderung;



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
        return;

    }



    aktuellerArtikel.bestand =
        neuerBestand;


    document.getElementById("bestand").innerHTML =
        neuerBestand;

}




function eingang(){

    let menge =
        Number(document.getElementById("menge").value);


    if(menge){

        bestandAendern(menge);

    }

}



function ausgang(){

    let menge =
        Number(document.getElementById("menge").value);


    if(menge){

        bestandAendern(-menge);

    }

}





// Neuer Artikel speichern

async function artikelAnlegen(){


    let artikel = {

        barcode:
        document.getElementById("neuBarcode").value,


        name:
        document.getElementById("neuName").value,


        bestand:
        Number(document.getElementById("neuBestand").value),


        lagerplatz:
        document.getElementById("neuLagerplatz").value

    };



    let { error } = await supabaseClient
        .from("Artikel")
        .insert([artikel]);



    if(error){

        console.log(error);
        alert("Fehler");

        return;

    }



    alert("Artikel gespeichert");


    document.getElementById("neuerArtikelBox").style.display =
        "none";


}






// Barcode Scanner

function scannerStarten(){


    if(scanner){

        return;

    }



    scanner = new Html5Qrcode("reader");



    scanner.start(

        {
            facingMode: "environment"
        },


        {
            fps: 10,
            qrbox: 250
        },


        function(barcode){


            document.getElementById("barcode").value =
                barcode;


            suchen();


        },


        function(error){

        }


    )

    .catch(function(error){

        console.log("Scanner Fehler:", error);

    });


}




// automatisch starten

window.addEventListener("load", function(){

    scannerStarten();

});