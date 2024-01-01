// components/Autocomplete.tsx

import React, { useEffect, useState } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

interface AutocompleteProps {
	onSelect: (item: Item) => void;
}

const Autocomplete: React.FC<AutocompleteProps> = ({ onSelect }) => {
	type Item = {
		id: number;
		name: string;
	};

	const [items, setItems] = useState<Item[]>([]);

	const handleOnSearch = async (string: string) => {
		try {
			const response = await fetch(`/api/search-song?keyword=${string}`);
			const songs = await response.json();
			setItems(songs);
		} catch (error) {
			console.error("Error fetching songs:", error);
		}
	};

	const handleOnHover = (result: any) => {
		// the item hovered
		console.log(result);
	};

	const handleOnSelect = (item: Item) => {
		// the item selected
		console.log(item);
		// Call the onSelect prop from the parent component
		onSelect(item);
	};

	const handleOnFocus = () => {
		console.log("Focused");
	};

	const formatResult = (item: Item) => {
		return (
			<>
				<span style={{ display: "block", textAlign: "left" }}>
					id: {item.id}
				</span>
				<span style={{ display: "block", textAlign: "left" }}>
					name: {item.name}
				</span>
			</>
		);
	};

	return (
		<ReactSearchAutocomplete
			items={items}
			onSearch={handleOnSearch}
			onHover={handleOnHover}
			onSelect={handleOnSelect}
			onFocus={handleOnFocus}
			autoFocus
			formatResult={formatResult}
		/>
	);
};

export default Autocomplete;
