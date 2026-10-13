import React, { useRef } from 'react';
import { createRoot } from 'react-dom/client';
import BaseAdminto from '@Adminto/Base';
import CreateReactScript from '../Utils/CreateReactScript';
import Table from '../Components/Adminto/Table';
import DxButton from '../Components/dx/DxButton';
import SwitchFormGroup from '@Adminto/form/SwitchFormGroup';
import SubscriptionsRest from '@Rest/Admin/SubscriptionsRest';
import ReactAppend from '../Utils/ReactAppend';
import Swal from 'sweetalert2';

const subscriptionsRest = new SubscriptionsRest()

const Subscriptions = () => {
  const gridRef = useRef()

  const onStatusChange = async ({ id, value }) => {
    const result = await subscriptionsRest.boolean({ id, field: 'status', value })
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const onDeleteClicked = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Eliminar suscripción',
      text: '¿Estás seguro de eliminar definitivamente esta suscripción? Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar definitivamente',
      cancelButtonText: 'Cancelar'
    })
    if (!isConfirmed) return
    const result = await subscriptionsRest.delete(id)
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  return (<>
    <Table gridRef={gridRef} title='Suscripciones' rest={subscriptionsRest}
      toolBar={(container) => {
        container.unshift({
          widget: 'dxButton', location: 'after',
          options: {
            icon: 'refresh',
            hint: 'Refrescar tabla',
            onClick: () => $(gridRef.current).dxDataGrid('instance').refresh()
          }
        });
      }}
      columns={[
        {
          dataField: 'id',
          caption: 'ID',
          visible: false
        },
        {
          dataField: 'name',
          caption: 'Proveedor',
        },
        {
          dataField: 'description',
          caption: 'Correo',
        },
        {
          dataField: 'created_at',
          caption: 'Fecha subscripcion',
          dataType: 'datetime',
          format: 'yyyy-MM-dd HH:mm:ss',
          sortOrder: 'desc'
        },
        {
          dataField: 'status',
          caption: 'Estado',
          dataType: 'boolean',
          width: '120px',
          cellTemplate: (container, { data }) => {
            $(container).empty()
            ReactAppend(container, (
              <SwitchFormGroup
                checked={Boolean(data.status)}
                onChange={() => onStatusChange({
                  id: data.id,
                  value: !data.status
                })}
              />
            ))
          }
        },
        {
          caption: 'Acciones',
          cellTemplate: (container, { data }) => {
            container.css('text-overflow', 'unset')
            container.append(DxButton({
              className: 'btn btn-xs btn-soft-danger',
              title: 'Eliminar definitivamente',
              icon: 'fa fa-trash',
              onClick: () => onDeleteClicked(data.id)
            }))
          },
          allowFiltering: false,
          allowExporting: false
        }
      ]} />
  </>
  )
}

CreateReactScript((el, properties) => {

  createRoot(el).render(<BaseAdminto {...properties} title='Suscripciones'>
    <Subscriptions {...properties} />
  </BaseAdminto>);
})