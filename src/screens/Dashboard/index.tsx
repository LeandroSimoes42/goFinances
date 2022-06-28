import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useCallback, useEffect, useState } from 'react'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import HighLightCard from '../../components/HIghLightCard'
import TransactionCard, { TransactionCardProps } from '../../components/TransactionCard'
import { format } from 'date-fns'
import { 
  Container, 
  Header, 
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  UserWrapper,
  IconPower,
  HighLightCards,
  Transactions,
  Title,
  TransectionsList,
  LogoutButton,
  LoadContainer
} from './styles'
import { useFocusEffect } from '@react-navigation/native'
import { ActivityIndicator } from 'react-native'
import { useTheme } from 'styled-components'
import { useAuth } from '../../providers/Auth/auth'


export interface DataListProps extends TransactionCardProps{
  id: string;
}

interface HighlightProps{
  amount: string,
  lastTransaction: string;
}

interface HighLightData{
  expensive: HighlightProps;
  entries: HighlightProps;
  total: HighlightProps;
}

export default function DashBoard() {
  const [isLoading, setIsLoading] = useState(true)
  const [data,setData] = useState<DataListProps[]>()
  const [highLightData, setHighLightData] = useState({} as HighLightData)
  const { signOut, user } = useAuth()
  const theme = useTheme();
  const dataKey = `@goFinance:Transactions_userId=${user?.id}`;
  let entriesTotal = 0
  let expensiveTotal = 0


  const getLastTransaction = (data:DataListProps[], type: 'positive' | 'negative' ) => {
    
    const transactions = data.filter((item) => item.type === type)
    
    if(transactions.length === 0){
      return '0'
    }
    
    const LastTransaction = new Date(Math.max.apply( Math,
      transactions
      .map((item) => new Date(item.date).getTime())
      ))
      return `dia ${LastTransaction.getDate()} de ${LastTransaction.toLocaleString('pt-BR', {
        month: 'long'
      })}`
  }

  const loadTransactions = async () => {
    const response = await AsyncStorage.getItem(dataKey)
    const transations = response ? JSON.parse(response) : []
    const transactionsFormatted: DataListProps[] = transations.map((item: DataListProps) => {
      if(item.type === 'positive'){
        entriesTotal = Number(item.amount) + entriesTotal
      }else{
        expensiveTotal += Number(item.amount)
      }
      const amount = Number(item.amount).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })

      const date = format(new Date(item.date), 'dd/MM/yyyy')

      return {
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        date,
        category: item.category
      }
    })

    const total = entriesTotal - expensiveTotal
    const lastTransactionEntries = getLastTransaction(transations, "positive")
    const lastTransactionExpensives = getLastTransaction(transations, "negative")
    const today = new Date()
    const interval = `01 à ${today.getDate()} de ${today.toLocaleString('pt-BR', {
      month: 'long'
    })}`

    setHighLightData({
      expensive: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: lastTransactionExpensives
      },
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: lastTransactionEntries
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: interval
      },
    })

    setData(transactionsFormatted)
    setIsLoading(false)
  }

  useFocusEffect(useCallback(() => {
    entriesTotal = 0
    expensiveTotal = 0
    loadTransactions()
  },[]))
  

  return (
    <Container>
      {
        isLoading ? 
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size='large'/>
        </LoadContainer> :
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{ uri: user?.photo }}/>
                <User>
                  <UserGreeting>Ola,</UserGreeting>
                  <UserName>{user?.name}</UserName>
                </User>
              </UserInfo>
              <LogoutButton onPress={() => signOut()}>
                <IconPower name='power'/>
              </LogoutButton>
            </UserWrapper>
          </Header>
          <HighLightCards>
            <HighLightCard 
              type='up'
              title='Entradas' 
              amount={highLightData.entries.amount} 
              lastTransaction={highLightData.entries.lastTransaction === '0' ? 'Sem entradas' : `Última entrada ${highLightData.entries.lastTransaction}`}/>
            <HighLightCard
              type='down'
              title='Saídas' 
              amount={highLightData.expensive.amount} 
              lastTransaction={highLightData.expensive.lastTransaction === '0' ? 'Sem saídas' : `Última saída ${highLightData.expensive.lastTransaction}`}/>
            <HighLightCard
              type='total' 
              title='Total' 
              amount={highLightData.total.amount} 
              lastTransaction={highLightData.total.lastTransaction}/>
          </HighLightCards>
          <Transactions>
            <Title>Listagem</Title>
            <TransectionsList 
              data={data}
              keyExtractor={ item => item.id}
              renderItem={({ item }) => <TransactionCard data={item}/>}
            />
          </Transactions>
        </>
      }
    </Container>
  )
}
