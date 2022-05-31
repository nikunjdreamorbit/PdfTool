const Axios =  require('axios');
const {PDFDocument} = require('pdf-lib');
const fs = require("fs");
// fs.createWriteStream("./docs/test.pdf")

const documentUrls = [
    "https://file-examples.com/storage/fef12739526267ac9a2b543/2017/10/file-sample_150kB.pdf",
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    "https://pdf-lib.js.org/assets/small_mario.png"
]

async function getDocuments(documentUrls){

    const allPromises = documentUrls.map((url)=>{
        return Axios.get(url,{
            responseType: "arraybuffer",
          })
    })

    return Promise.all(allPromises);

}

async function run(){

    // const bufferData = (await getDocuments(documentUrls)).map((res)=>res.data);


    const pdfData = await readLocalFile('./test.pdf'); // Add your test.pdf file in this directory
    const fromSourcePDF = await PDFDocument.load(pdfData);
    const targetPDF = await PDFDocument.create(); // This is new created.
    const pageNumbers = [1,3,4]; // makesure your pdf file has more than 6 pages to test this

    (await targetPDF.copyPages(fromSourcePDF, pageNumbers)).forEach((page)=>{
        targetPDF.addPage(page);
    })

    const resultPdfFile = await targetPDF.save();

    fs.writeFile('./result.pdf',resultPdfFile,(res)=>{
        console.log(res);
    })


    // const copiedPagesA = await mergedPdf.copyPages(pdfA, pdfA.getPageIndices());
    // copiedPagesA.forEach((page) => mergedPdf.addPage(page));

    // const mergedPdfFile = await mergedPdf.save();

    // fs.writeFile('./demo.pdf',mergedPdfFile,(res)=>{
    //     console.log(res);
    // })


}

async function readLocalFile(path){
    const readStream = fs.createReadStream(path);
    const data = [];

    return new Promise((resolve,reject)=>{

        readStream.on('data', (chunk) => {
            data.push(chunk);
            console.log('data :', chunk, chunk.length);
        });

        readStream.on('end', () => {
             resolve(Buffer.concat(data));
        })

        readStream.on('error', (err) => {
            console.log('error :', err)
            reject(err);
        })

    })


}

run();
