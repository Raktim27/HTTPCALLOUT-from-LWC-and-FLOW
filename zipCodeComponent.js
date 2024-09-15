import { LightningElement, track } from 'lwc';
import getZipCodeInfo from '@salesforce/apex/ZipCodeController.getZipCodeInfo';

const countryOptions = [
        { label: 'India', value: 'IN' },
        { label: 'USA', value: 'US' },
        { label: 'Mexico', value: 'MX' },
        { label: 'Australia', value: 'AU' },
        { label: 'Germany', value: 'DE' }]

export default class ZipCodeComponent extends LightningElement {
    @track country;
    @track zipCode;
    @track errorMessage;
    countryOptions = countryOptions;
    enableScreen = false;
    @track result = [];

    handlecountryValue(event) {
        this.country = event.target.value;
        this.enableScreen = false;
        this.zipCode = [];
    }

    handleInputChange(event) {
        this.zipCode = event.target.value;
    }

    handleLookup() {
        this.errorMessage = '';
        if (this.zipCode) {
            getZipCodeInfo({ country : this.country, zipCode: this.zipCode })
                .then((result) => {
                    if (result.country === 'United States') {
                        this.enableScreen = true;
                        this.result.country = result.country;
                        this.result.state = result.places[0].state;
                        this.result.place = result.places[0]['place name'];
                    } else {
                        this.errorMessage = 'Non-US Country detected. Data has been stored.';
                    }
                })
                .catch((error) => {
                    this.errorMessage = 'Error in fetching ZIP Code details';
                    console.error(error);
                });
        } else {
            this.errorMessage = 'Please enter a valid ZIP Code';
        }
    }
}