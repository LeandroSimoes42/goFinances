import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useCallback, useEffect, useState } from 'react'
import CardResume from '../../components/CardResume'
import { categories } from '../../utils/categories'
import { ChartContainer, Container, Content, Header, Icon, LoadContainer, Month, MonthSelect, MonthSelectButton, Title } from './styles'
import { VictoryPie } from 'victory-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { useTheme } from 'styled-components'
import { useFocusEffect } from '@react-navigation/native'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { addMonths, subMonths } from 'date-fns/esm'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { ActivityIndicator } from 'react-native'
import { useAuth } from '../../providers/Auth/auth'

export interface Transaction{
    type: 'positive' | 'negative'
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryData{
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percent: string;
}

const Resume = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])
    const [selectedDate, setSelectedDate] = useState(new Date())
    const { user } = useAuth()
    const dataKey = `@goFinance:Transactions_userId=${user?.id}`;
    const theme = useTheme()


    const handleChangeDate = (action: 'next' | 'prev') => {
        if(action === 'next'){
            const newDate = addMonths(selectedDate, 1)
            setSelectedDate(newDate)
        }else{
            const newDate = subMonths(selectedDate, 1)
            setSelectedDate(newDate)
        }
        
    }

    const loadData = async () => {
        setIsLoading(true)
        const dataAsync = await AsyncStorage.getItem(dataKey)
        const currentData = dataAsync ? JSON.parse(dataAsync) : []
        const expensive: Transaction[]  = currentData.filter(
            (item: Transaction ) => item.type === 'negative' && 
            new Date(item.date).getMonth() === selectedDate.getMonth() &&
            new Date(item.date).getFullYear() === selectedDate.getFullYear()
        )
        
        const expensiveTotal = expensive.reduce((acumullator: number, expensive: Transaction) => 
        { 
            return acumullator + Number(expensive.amount)
        }, 0)
        
        let totalByCategory: CategoryData[] = []; 

        categories.forEach((categorie) => {
            let categorieSum = 0

            expensive.forEach((element: Transaction) => {
                if(element.category === categorie.key){
                    categorieSum += Number(element.amount)
                }
            })

            if(categorieSum > 0){
                const total = categorieSum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                })

                const percent = `${((categorieSum / expensiveTotal) * 100).toFixed(0)}%`
                totalByCategory.push({
                    key: categorie.key,
                    name: categorie.name,
                    total: categorieSum,
                    totalFormatted: total,
                    color: categorie.color,
                    percent
                })
            }
        });
        setTotalByCategories(totalByCategory)
        setIsLoading(false);
    }

    useFocusEffect(useCallback(() => {
        loadData()
    }, [selectedDate]))
    

    return (
      <Container>
            <Header>
                <Title>Resumo</Title>
            </Header>
            {
              isLoading ? 
                <LoadContainer>
                    <ActivityIndicator color={theme.colors.primary} size='large'/>
                </LoadContainer> :
                <Content showsVerticalScrollIndicator={false} contentContainerStyle={{
                    padding: 24,
                    paddingBottom: useBottomTabBarHeight(),
                }}>
                    <MonthSelect>
                        <MonthSelectButton>
                            <Icon name='chevron-left' onPress={() => handleChangeDate('prev')}/>
                        </MonthSelectButton>
                        <Month>{format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}</Month>
                        <MonthSelectButton onPress={() => handleChangeDate('next')}>
                            <Icon name='chevron-right'/>
                        </MonthSelectButton>
                    </MonthSelect>
                    <ChartContainer>
                        <VictoryPie 
                        data={totalByCategories}
                        colorScale={totalByCategories.map((category) => category.color)}
                        style={{
                            labels: {
                                fontSize: RFValue(18),
                                fontWeight: 'bold',
                                fill: theme.colors.shape
                            }
                        }}
                        labelRadius={50}
                        x='percent'
                        y='total'
                        />
                    </ChartContainer>
                    {
                        totalByCategories.map((item, index) => {
                            return <CardResume title={item.name} amount={item.totalFormatted} color={item.color} key={item.key}/>
                        })
                    }
                </Content>
        }
      </Container>
  )
}

export default Resume
