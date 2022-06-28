import React, { useState } from 'react'
import { RFValue } from 'react-native-responsive-fontsize'
import { 
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper
} from './styles'

import LogoSvg from '../../assets/logo.svg'
import GoogleSvg from '../../assets/google.svg'
import AppleSvg from '../../assets/apple.svg'
import SignInButton from '../../components/SignInButton'
import { useAuth } from '../../providers/Auth/auth'
import { ActivityIndicator, Alert } from 'react-native'
import { useTheme } from 'styled-components'

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const { logInWithGoogle } = useAuth()
  const theme = useTheme()

  const handleSignInWithGoogle = async () => {
    try {
      setIsLoading(true)
      return await logInWithGoogle()
    } catch (error) {
      console.log(error)
      Alert.alert('Não foi possivel realizar login com o google')
      setIsLoading(false)
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg width={RFValue(120)} height={RFValue(68)}>

          </LogoSvg>
          <Title>
            Controle suas {'\n'}
            Finanças de forma {'\n'}
            muito simples
          </Title>
        </TitleWrapper>
        <SignInTitle>
          Faça seu login {'\n'}
          com uma das contas abaixo
        </SignInTitle>
      </Header>
      <Footer>
        <FooterWrapper>
          <SignInButton title='Entrar com o google' svg={GoogleSvg} onPress={() => handleSignInWithGoogle()}/>
        </FooterWrapper> 
        {isLoading && <ActivityIndicator color={theme.colors.shape} style={{marginTop: 18}}/>} 
      </Footer>
    </Container>
  )
}
