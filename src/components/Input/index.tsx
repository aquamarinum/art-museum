import { FC, useState } from 'react';
import { FavouritesType } from '@constants/FavouritesType';
import { CardType } from '@constants/CardType';
import { Formik, FormikHelpers, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { searchData } from '../../utils/searchData';

import Card from '../../components/Card';
import Headline from '../../components/Headline';
import { Flex } from '../Catalog/styled';
import { CardItemWrapper } from '../../components/Card/styled';
import { InputStyles } from './styled';
import search_icon from '../../assets/img/icon-search.png';

interface IValues {
	query: string;
}

const QuerySchema = Yup.object().shape({
	query: Yup.string()
		.required('Required')
		.min(2, 'Query should be 2 or more symbols')
		.max(30, 'Query should be less than 30 symbols')
		.matches(
			/^[0-9a-zA-Z]{3,20}[0-9a-zA-Z\s]{0,20}$/,
			'You can use only a-z,0-9 symbols and backspaces'
		),
});

const Input: FC<FavouritesType> = ({ favourites, callback }) => {
	const [searchResult, setSearchResult] = useState<CardType[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<unknown | null>(null);
	if (error)
		return (
			<Headline
				title="Something gone wrong..."
				subtitle="API or our server working with errors"
			/>
		);
	return (
		<InputStyles $isloading={loading}>
			<Formik
				initialValues={{
					query: '',
				}}
				onSubmit={(
					values: IValues,
					{ setSubmitting }: FormikHelpers<IValues>
				) => {
					setTimeout(() => {
						searchData(
							`https://api.artic.edu/api/v1/artworks/search?q=${values.query.toLocaleLowerCase()}&limit=9`
						)
							.then((resultResp) => {
								setSearchResult(resultResp.data);
								setLoading(false);
							})
							.catch((err) => {
								console.log('ERR2: ', err);
								setError(err);
								setLoading(true);
							});
					}, 500);
				}}
				validationSchema={QuerySchema}
			>
				<Form>
					<ErrorMessage name="query" component="label" />
					<Field name="query" placeholder="Search Art, Artist, Work..." />
					<button type="submit">
						<img src={search_icon} alt="search-icon-form" />
					</button>
				</Form>
			</Formik>
			<Flex>
				{searchResult.map((card) => (
					<CardItemWrapper key={card.id}>
						<Card
							{...card}
							state={
								favourites?.find((elem) => elem.id === card.id) ? true : false
							}
							callback={callback}
						/>
					</CardItemWrapper>
				))}
			</Flex>
		</InputStyles>
	);
};

export default Input;
