import React from 'react';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';

const PhoneNumberInput = ({ value, onChange }) => {
	
	return (
		<PhoneInput
			country={'ru'} 
			value={value}
			onChange={onChange}
			inputStyle={{
				width: '100%',
				height: '40px',
				fontSize: '14px',
			}}
		/>
	);
};

export default PhoneNumberInput;
