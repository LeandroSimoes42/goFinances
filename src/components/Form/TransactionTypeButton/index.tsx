import React from 'react'
import { TouchableOpacityProps } from 'react-native'
import { Container, Icon, Title } from './styles';


const icon = {
    up: 'arrow-up-circle',
    down: 'arrow-down-circle'
}


interface Props extends TouchableOpacityProps{
    title: string;
    type: 'up' | 'down'
    isActive: boolean;
}

export default function TransactionTypeButton({ title, type, isActive,...rest }:Props) {
  return (
    <Container {...rest} isActive={isActive} type={type}>
        <Icon name={icon[type]} type={type}/>
        <Title>
            {title}
        </Title>
    </Container>
  )
}
