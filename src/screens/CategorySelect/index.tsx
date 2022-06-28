import React from 'react'
import { FlatList } from 'react-native';
import { Button } from '../../components/Form/Button';
import { categories } from '../../utils/categories';
import { Category, Container, Footer, Header, Icon, Name, Separator, Title } from './styels'


interface Category{
    key: string;
    name: string;
}

interface Props{
    category: Category;
    setCategory: (item: Category) => void;
    closeCategory: () => void;
}

export default function CategorySelect({ category, setCategory, closeCategory }:Props) {
  return (
    <Container>
        <Header>
            <Title>Categorias</Title>
        </Header>
        <FlatList 
            style={{flex: 1, width: '100%'}}
            data={categories}
            keyExtractor={item => item.key}
            renderItem={({ item }) => (
                <Category onPress={() => setCategory(item)} isActive={category.key === item.key}>
                    <Icon name={item.icon}/>
                    <Name>{item.name}</Name>
                </Category>
            )}
            ItemSeparatorComponent={() => <Separator/>}
        />
        <Footer>
            <Button title='Selecionar' onPress={closeCategory}/>
        </Footer>
    </Container>
  )
}
