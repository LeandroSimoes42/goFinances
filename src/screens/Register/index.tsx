import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from 'react-native'
import { Button } from '../../components/Form/Button'
import CategorySelectButton from '../../components/Form/CategorySelectButton'
import InputForm from '../../components/Form/InputForm'
import TransactionTypeButton from '../../components/Form/TransactionTypeButton'
import CategorySelect from '../CategorySelect'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'

import { 
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionTypes
 } from './styles'
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native'
import { useAuth } from '../../providers/Auth/auth'

interface FormData {
    name: string;
    amount: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  amount: Yup
    .number()
    .typeError('Informe um valor numérico')
    .positive('Informe um valor positivo')
    .required('Valor é obrigatório')
})

export default function Register() {
  const [TransactionType, setTransactionType] = useState('')
  const [categoryModalOpen, setCategoryModalOpen] = useState<boolean>(false)
  const { user } = useAuth()
  const dataKey = `@goFinance:Transactions_userId=${user?.id}`;
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria'
  })

  const { navigate }: NavigationProp<ParamListBase> = useNavigation()

  const handleTransactionTypeButton = (type: 'positive' | 'negative') => {
    setTransactionType(type)
  }

  const handleOpenModalCategory = () => {
    setCategoryModalOpen(true)
  }

  const handleCloseModalCategory = () => {
    setCategoryModalOpen(false)
  }

  const { control, handleSubmit, reset ,formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  const handleOnSubmit = async (form: Partial<FormData>) => {
    if(!TransactionType)
      return Alert.alert('Selecione o tipo de transação')

    if(category.key === 'category')
      return Alert.alert('Selecione uma categoria')

    const data = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: TransactionType,
      category: category.key,
      date: new Date(),
    }

    try{
      const dataAsync = await AsyncStorage.getItem(dataKey)
      const currentData = dataAsync ? JSON.parse(dataAsync) : [] 
      const dataFormatted = [
        ...currentData,
        data
      ]

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted))
      
      Alert.alert('Item cadastrado com sucesso')
      
      reset(),
      
      setTransactionType('')
      setCategory({
        key: 'category',
        name: 'Categoria'
      })
      
      navigate('Listagem');

    }catch(error){
      Alert.alert('Não foi possivel fazer o armazenamento')
      console.log(error)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
          <Header>
              <Title>Cadastro</Title>
          </Header>
          <Form>
            <Fields>
              <InputForm control={control} name='name' placeholder='Nome' autoCapitalize='sentences' autoCorrect={false} error={errors.name && errors.name.message}/>
              <InputForm control={control} name='amount' placeholder='Preço' keyboardType='numeric' error={errors.amount && errors.amount.message}/>
              <TransactionTypes>
                <TransactionTypeButton 
                  type='up' 
                  title='income' 
                  onPress={() => handleTransactionTypeButton('positive')}
                  isActive={TransactionType === 'positive'}
                  />
                <TransactionTypeButton 
                  type='down' 
                  title='Outcome' 
                  onPress={() => handleTransactionTypeButton('negative')}
                  isActive={TransactionType === 'negative'}
                  />
              </TransactionTypes>
              <CategorySelectButton title={category.name} onPress={handleOpenModalCategory}/>
            </Fields>
            <Button title='Enviar' onPress={handleSubmit(handleOnSubmit)}/>
          </Form>
          <Modal visible={categoryModalOpen}>
            <CategorySelect 
              category={category}
              closeCategory={handleCloseModalCategory}
              setCategory={setCategory}
            />
          </Modal>
      </Container>
    </TouchableWithoutFeedback>
  )
}
