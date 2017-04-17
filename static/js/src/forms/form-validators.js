export const formValidators = {
    validateInfo(elementName, data, validators, context) {
        const element = document.querySelector(`[name=${elementName}]`);
        const validatorArray = JSON.parse(validators);
        
        validatorArray.forEach(validator => {
            const validatorName = validator.errorName;
            const errorId = `${elementName}:${validatorName}`;
            const alreadyTracked = context.errorList.includes(errorId);

            if(!this[validatorName](data)) {
                element.classList.add('form-error');
                if(!alreadyTracked) { context.errorList.push(errorId);  }
            } else {
                element.classList.remove('form-error');
                if(alreadyTracked) { context.errorList.splice(errorId, 1); }
            }
        });
    },

    required(data) {
        return data;
    },

    min6(data) {
        return data.length >= 6;
    }
};