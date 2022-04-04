
export const getBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
  let reader = new FileReader();
  
  return new Promise((resolve, reject) => {
    reader.onerror = (error) => {
      reader.abort();
      reject(new DOMException("Problem parsing input file."));
      console.log('Error: ', error);
    };

    reader.readAsDataURL(file);

    reader.onload = () => {
      resolve(reader.result);
    };
  });
}
