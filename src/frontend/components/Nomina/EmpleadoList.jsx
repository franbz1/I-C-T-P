import React from "react";
import EmpleadoItem from "../Nomina/EmpleadoItem";
import EmpleadoItemSinEdit from "../Nomina/EmpleadoItemSinEdit";

const EmpleadoList = ({
  empleados,
  expandedId,
  toggleExpand,
  handleDelete,
  allowEdit,
}) => {
  const EmpleadoComponent = allowEdit ? EmpleadoItem : EmpleadoItemSinEdit;

  return (
    <>
      {empleados.map((empleado) => (
        <EmpleadoComponent
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
