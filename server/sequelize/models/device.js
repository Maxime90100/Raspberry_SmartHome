const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const axios = require("axios");

const Device = sequelize.define('Device', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    dataFetcher: {
        type: DataTypes.JSON,
        allowNull: true,
        validate: {
            validateDataFetcher(value) {
                isValidDataFetcher(value)
            },
        }
    }
});

Device.prototype.fetchData = function() {
    if(!this.dataFetcher)
        throw new Error('No dataFetcher defined.')
    if(this.dataFetcher.type === 'api'){
        const url = `${this.dataFetcher.url}?${Object.entries(this.dataFetcher.queries || {}).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&')}`;
        return axios({
            method: 'get',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                ...this.dataFetcher.headers,
            },
        });
    }
};

Device.addScope('defaultScope', {
    attributes: { exclude: ['createdAt','updatedAt'] },
});

const allDataFetchers = {
    api: {
        url: {
            type: 'string'
        },
        queries: {
            type: 'object',
            allowNull: true,
            validate: {
                validateQueries(value){
                    isValidKeyValueObject(value)
                }
            }
        },
        headers: {
            type: 'object',
            allowNull: true,
            validate: {
                validateHeaders(value){
                    isValidKeyValueObject(value)
                }
            }
        }
    }
}

const isValidDataFetcher = (dataFetcher) => {
    const selectedDataFetcher = allDataFetchers[dataFetcher.type]
    if(!selectedDataFetcher)
        throw new Error(`DataFetcher type must be a valid type. (${Object.keys(allDataFetchers)})`)
    Object.keys(selectedDataFetcher).forEach(attribute => {
        if(!dataFetcher[attribute] && !selectedDataFetcher[attribute].allowNull)
            throw new Error(`${dataFetcher.type.toUpperCase()} DataFetcher must have "${attribute}" value.`)
        if(dataFetcher[attribute]) {
            if (selectedDataFetcher[attribute].type && typeof dataFetcher[attribute] !== selectedDataFetcher[attribute].type)
                throw new Error(`${dataFetcher.type.toUpperCase()} DataFetcher : "${attribute}" must be ${selectedDataFetcher[attribute].type} type.`)
            if(selectedDataFetcher[attribute].validate){
                for (const validationFunction of Object.values(selectedDataFetcher[attribute].validate)) {
                    try{
                        validationFunction.call(dataFetcher, dataFetcher[attribute]);
                    }catch (e) {
                        throw new Error(`${dataFetcher.type.toUpperCase()} DataFetcher : "${attribute}" validation error : ${e.message}`)
                    }
                }
            }
        }
    })
}
const isValidKeyValueObject = (object) => {
    Object.keys(object).forEach(key => {
        const validTypes = ['string','number','boolean']
        if (!validTypes.includes(typeof object[key]))
            throw new Error(`Key "${key}" must be a valid type. (${validTypes})`);
    })
}

module.exports = Device;
