import { TouchableOpacity } from "react-native";
import styled, { css } from "styled-components/native";
import { Feather } from "@expo/vector-icons"
import { RFValue } from "react-native-responsive-fontsize";

interface IconProps {
    type: 'up' | 'down';
}

interface ContainerProps {
    isActive: boolean;
    type: 'up' | 'down';
}


export const Container = styled(TouchableOpacity)<ContainerProps>` 
    width: 48%;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border: 1.5px solid ${({ theme }) => theme.colors.text};
    border-radius: 5px;
    padding: 16px;
    ${({ isActive, type }) => isActive && type === "down" && css`
        background-color: ${({ theme }) => theme.colors.attention_light};
        border: none;
    `}

    ${({ isActive, type }) => isActive && type === "up" && css`
        background-color: ${({ theme }) => theme.colors.success_light};
        border: none;
    `}
`

export const Icon = styled(Feather)<IconProps>`
    font-size: ${RFValue(24)}px;
    margin-right: 12px;
    color: ${({ theme, type }) => type === "up" ? theme.colors.success : theme.colors.attention};
`


export const Title = styled.Text`
    color: ${({ theme }) => theme.colors.text_dark};
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;

` 
