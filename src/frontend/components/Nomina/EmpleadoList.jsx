import React from "react";
import EmpleadoItem from "./EmpleadoItem";

const EmpleadoList = ({
  empleados,
  expandedId,
  toggleExpand,
  handleDelete,
}) => {
  return (
    <>
      {empleados.map((empleado) => (
        <EmpleadoItem
          key={empleado.id}
          empleado={empleado}
          expandedId={expandedId}
          toggleExpand={toggleExpand}
          handleDelete={handleDelete}
        />
      ))}
    </>
  );
};

export default EmpleadoList;
