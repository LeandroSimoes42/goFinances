import React from 'react'
import { Control, Controller } from 'react-hook-form'
import { TextInputProps } from 'react-native'
import { Input } from '../Input';
import { Container, Error } from './styles';


interface Props extends TextInputProps{
    control: Control;
    name: string;
    error?: string;
}

export default function InputForm({ name, control, error ,...rest }:Props) {
  return (
    <Container>
        <Controller 
            control={control}
            name={name}
            render={({ field: { onChange, value } }) => (
                <Input {...rest} onChangeText={onChange} value={value}/>
            )}
        />
        {error && <Error>{error}</Error>}
    </Container>
  )
}
