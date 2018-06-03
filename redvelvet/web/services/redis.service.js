class RedisService {
  constructor() {
    this.$http = axios;

    this.KeyType = {
      STRING: 'STRING',
      LIST: 'LIST',
      SET: 'SET',
      ZSET: 'ZSET',
      HASH: 'HASH'
    }
  }

  getConnections() {
    const url = '/api/connections';
    return this.$http.get(url)
      .then(response => response.data)
      .catch(error => {
        console.log(error);
      });
  }

  getKeys(connectionLabel) {
    const url = '/api/connections/' + connectionLabel + '/keys';
    return this.$http.get(url)
      .then(response => response.data)
      .catch(error => {
        console.log(error);
      });
  }

  createKey(connectionLabel, data) {
    const url = '/api/connections/' + connectionLabel + '/keys';
    return this.$http.post(url, data)
      .then(response => '')
      .catch(error => {
        console.log(error);
      });
  }

  deleteKey(connectionLabel, key) {
    const url ='/api/connections/' + connectionLabel + '/keys/' + key;
    return this.$http.delete(url)
      .then(response => '')
      .catch(error => {
        console.log(error);
      });
  }

  getValues(connectionLabel, key, type) {
    const url = '/api/connections/' + connectionLabel + '/keys/' + key + '/values';
    return this.$http.get(url, {params: {type: type}})
      .then(response => response.data)
      .catch(error => {
        console.log(error);
      });
  }

  createOrUpdateValue(connectionLabel, key, type, value) {
    const url = '/api/connections/' + connectionLabel + '/keys/' + key + '/values?type=' + type;
    return this.$http.post(url, {value: value})
      .then(response => '')
      .catch(error => {
        console.log(error);
      });
  }

  deleteValue(connectionLabel, key, type, value) {
    const url = '/api/connections/' + connectionLabel + '/keys/' + key + '/values/' + value + '?type=' + type;
    return this.$http.delete(url)
      .then(response => '')
      .catch(error => {
        console.log(error);
      });
  }
}

const redisService = new RedisService();
