import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Pokeball } from "../Spinner";
import { Pagination } from "semantic-ui-react";
import PokemonCard from "../PokemonCard";
import Search from "../Search";

// Importe a implementação da árvore binária
import BinarySearchTree from "../../utils/BinarySearchTree"; // Supondo que você tenha um utilitário para a árvore binária

import { App, PaginationContainer } from "./styles";

const PokemonList = () => {
  const [pokemons, setPokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPokemon] = useState(807);
  const [pokemonPerPage] = useState(54);
  const [currentPage, setCurrentPage] = useState(0);
  const [query, setQuery] = useState("");

  const pokemonTree = new BinarySearchTree(); // Cria uma instância da árvore binária

  useEffect(() => {
    const fetchPokemons = async () => {
      await api
        .get(`/pokemon?limit=${totalPokemon}`)
        .then((response) => {
          response.data.results.forEach((pokemon) => {
            // Insira cada Pokémon na árvore binária pelo nome
            pokemonTree.insert(pokemon.name, pokemon);
          });
        });

      // Obtenha os Pokémon ordenados pelo nome
      const sortedPokemons = pokemonTree.inOrderTraversal();

      // Página atual a ser exibida
      const currentPagePokemons = sortedPokemons.slice(
        currentPage * pokemonPerPage,
        (currentPage + 1) * pokemonPerPage
      );

      setPokemons(currentPagePokemons);
      setIsLoading(false);
    };
    fetchPokemons();
  }, [currentPage, totalPokemon, pokemonPerPage, pokemonTree]);

  const onPaginationClick = (e, pageInfo) => {
    setCurrentPage(pageInfo.activePage - 1);
  };

  const totalPage = Math.ceil(totalPokemon / pokemonPerPage);

  const renderPokemonsList = () => {
    const pokemonsList = [];

    pokemons.forEach((pokemon) => {
      if (!pokemon.name.includes(query)) {
        return;
      }

      pokemonsList.push(<PokemonCard key={pokemon.name} pokemon={pokemon} />);
    });

    return pokemonsList;
  };

  return isLoading ? (
    <Pokeball />
  ) : (
    <>
      <Search getQuery={(q) => setQuery(q)} />

      <PaginationContainer>
        <Pagination
          defaultActivePage={currentPage + 1}
          totalPages={totalPage}
          onPageChange={onPaginationClick}
        />
      </PaginationContainer>

      <App>{renderPokemonsList()}</App>
    </>
  );
};

export default PokemonList;
