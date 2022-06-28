import styled from "styled-components/native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Feather } from "@expo/vector-icons"
import { getBottomSpace, getStatusBarHeight } from "react-native-iphone-x-helper";
import { FlatList } from "react-native";
import { DataListProps } from ".";
import { BorderlessButton, GestureHandlerRootView } from "react-native-gesture-handler";

export const Container = styled(GestureHandlerRootView)` 
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background};
`

export const Header = styled.View`
    width: 100%;
    height: ${RFPercentage(42)}px;
    background-color: ${({ theme }) => theme.colors.primary};
    align-items: flex-start;
    flex-direction: row;
    justify-content: center;

`

export const UserWrapper = styled.View`
    width: 100%;
    padding: 0 24px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: ${getStatusBarHeight() + RFValue(28)}px;
`

export const UserInfo = styled.View`
    flex-direction: row;
    align-items: center;
`


export const Photo = styled.Image`
    width: ${RFValue(48)}px;
    height: ${RFValue(48)}px;
    border-radius: ${RFValue(10)}px;
`


export const User = styled.View`
    margin-left: 17px;
`


export const UserGreeting = styled.Text`
    color: ${({ theme }) => theme.colors.shape};
    font-size: ${RFValue(18)}px;
    font-family: ${({ theme }) => theme.fonts.regular};

`


export const UserName = styled.Text`
    color: ${({ theme }) => theme.colors.shape};
    font-size: ${RFValue(18)}px;
    font-family: ${({ theme }) => theme.fonts.bold};


`

export const LogoutButton = styled(BorderlessButton as new(props: any) => BorderlessButton)``

export const IconPower = styled(Feather)`
    color: ${({ theme }) => theme.colors.secondary};
    font-size: ${RFValue(24)}px;

`

export const HighLightCards = styled.ScrollView.attrs({
    horizontal: true,
    showsHorizontalScrollIndicator: false,
    contentContainerStyle: {paddingHorizontal: 24 }
})`
    width: 100%;
    position: absolute;
    margin-top: ${RFPercentage(20)}px;
`

export const Transactions = styled.View `
    flex: 1;
    padding: 0 24px;
    margin-top: ${RFPercentage(15)}px;
`

export const Title = styled.Text`
    font-size: ${RFValue(18)}px;
    font-family: ${({ theme }) => theme.fonts.regular};
    margin-bottom: 16px;
`

export const TransectionsList = styled(
        FlatList as new () => FlatList<DataListProps>
    ).attrs({
    showsVerticalScrollIndicator:false,
    contentContainerStyle:{
        paddingBottom: getBottomSpace()
    }
})``

export const LoadContainer = styled.View`
    flex: 1;
    justify-content: center;
`