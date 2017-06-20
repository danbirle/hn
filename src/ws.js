import axios from 'axios';

export function loadSingle(uri, callback) {
  return axios.get(uri).then(function (response) {
    callback(response);
  });
}

export function loadMultiple(url, params, callback) {
  var itemsProcessed = 0;
  var returnData = [];
  params.forEach((item, index, array) => {
    axios.get(url+item+'.json').then(function (response) {
      returnData.push(response.data);
      itemsProcessed++;
      if (itemsProcessed === array.length) {
        callback(returnData);
      }
    });
  });
}
