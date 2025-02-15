import apiService from "../services/apiService";

const imageUrl = (image,path="") => {

  if(image === "" || image === null){
    image =  "images/no-image.png";
  }
 const url = `${apiService.appUrl}${path}/${image}`;
    return url;
};

const baseUrl = (image) => {
    const url = `${apiService}/${image}`;
    return url;
};

const  prepareSelectOption =(data)  =>{
    return data && data.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  };
  

  const getUrl = (index) => {
    return location.pathname.split("/")[index];

};


export { imageUrl, baseUrl,prepareSelectOption,getUrl };
