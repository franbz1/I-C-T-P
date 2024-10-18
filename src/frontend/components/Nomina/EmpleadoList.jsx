import React from "react";
import EmpleadoItem from "../Nomina/EmpleadoItem"; // Componente con edición
import EmpleadoItemSinEdit from "../Nomina/EmpleadoItemSinEdit"; // Componente sin edición

const EmpleadoList = ({
  empleados,
  expandedId,
  toggleExpand,
  handleDelete,
  allowEdit, // Prop que determina si se permite la edición
}) => {
  return (
    <>
      {empleados.map((empleado) => (
        allowEdit ? (
          <EmpleadoItem
            key={empleado.id}
            empleado={empleado}
            expandedId={expandedId}
            toggleExpand={toggleExpand}
            handleDelete={handleDelete}
          />
        ) : (
          <EmpleadoItemSinEdit
            key={empleado.id}
            empleado={empleado}
            expandedId={expandedId}
            toggleExpand={toggleExpand}
            handleDelete={handleDelete}
          />
        )
      ))}
    </>
  );
};

export default EmpleadoList;
