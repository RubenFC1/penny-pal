import React, { useEffect, useState } from "react";
import { getCategorias } from "../../api/api2";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await getCategorias();
        setCategorias(data);
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  return (
    <div>
      <h1>Categorías</h1>
      <ul>
        {categorias.map((categoria) => (
          <li key={categoria.id}>{categoria.nombre}</li>
        ))}
      </ul>
    </div>
  );
};

export default Categorias;
