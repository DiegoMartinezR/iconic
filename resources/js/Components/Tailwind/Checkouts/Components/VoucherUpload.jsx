import React, { useRef } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import axios from 'axios';
import Swal from 'sweetalert2';

registerPlugin(FilePondPluginImagePreview);

const VoucherUpload = ({ csrfToken, saleCode, voucher, setVoucher }) => {
  const pond = useRef(null);

const serverConfig = {
    process: {
        url: '/api/vouchers/temp',
        method: 'POST',
        headers: { 'X-CSRF-TOKEN': csrfToken },
        // Especificar cómo obtener el ID único de la respuesta
        onload: (response, ...props) => {
            const data = JSON.parse(response);
            return data.id; // Asegurar que FilePond recibe el ID
        },
        ondata: (formData) => {
            // Interceptar el archivo antes de ser enviado al backend
            setVoucher(formData.getAll('voucher')[1]);
            return formData;
        }
    },
    revert: (uniqueFileId, load) => {
        axios.delete(`/api/vouchers/temp/${uniqueFileId}`, {
            headers: { 'X-CSRF-TOKEN': csrfToken }
        }).then(() => {load() , setVoucher()})
            .catch(() => {load(), setVoucher()});
    }
};
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const files = pond.current.getFiles().map(file => file.serverId);
      const response = await axios.post(route('guardarvoucher'), { files }, {
        headers: { 'X-CSRF-TOKEN': csrfToken }
      });

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: response.data.message || 'Voucher subido correctamente.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#052F4E'
        }).then(() => {
          window.location.href = route('agradecimiento', { codigoCompra: saleCode });
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'warning',
        title: '¡Error!',
        text: error.response?.data?.message || 'No se cargó el Voucher.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#052F4E'
      });
    }
  };

  return (
    <div className='relative px-4 pt-8 pb-4 my-3 rounded-2xl border border-dashed bg-[#f1f1f1]'>
      <form id="formVoucher" onSubmit={handleSubmit}>
        <FilePond
          ref={pond}
          name="voucher"
          allowMultiple={true}
          maxFiles={2}
          maxFileSize="5MB"
          acceptedFileTypes={['image/png', 'image/jpeg', 'application/pdf']}
          allowImagePreview={true}
          labelIdle='
            <div class="filepond--label-container" style="cursor:pointer">
              <h3 class="text-base 2xl:text-lg font-normal pb-1 customtext-primary text-center" style="font-size:16px">
                Sube tu comprobante de pago <span class="text-[#91502D]">aquí</span>
              </h3>
              <p class="customtext-primary text-sm 2xl:text-base text-center" style="font-size:14px">
                Ayúdanos a verificar tu pago más rápido. Selecciona el archivo.
              </p>
              <div class="flex flex-row items-center justify-center mt-1 mb-6" style="font-size:12px;">
                <p class="customtext-primary text-xs 2xl:text-sm text-center">
                  Formato aceptado: JPG, PNG o PDF
                </p>
                <span class="px-1">|</span>
                <p class="customtext-primary text-xs 2xl:text-sm text-center" >
                  Tamaño máximo: 5 MB
                </p>
              </div>
            </div>
          '
          stylePanelAspectRatio="0"
          stylePanelLayout="compact"
          labelFileProcessingComplete=""
          labelFileProcessing=""
          labelFileLoading=""
          labelFileLoadError=""
          labelTapToCancel=""
          labelTapToRetry=""
          labelTapToUndo=""
          labelButtonRemoveItem=""
          labelButtonAbortItemLoad=""
          labelButtonAbortItemProcessing=""
          labelButtonProcessItem=""
          styleLoadIndicatorDisplay="none"
          styleProgressIndicatorDisplay="none"
          styleButtonRemoveItemDisplay="none"
          styleButtonProcessItemDisplay="none"
          credits={false}
          style={{ display: 'contents', marginTop: '1rem' }}
          server={serverConfig}
          onupdatefiles={(e) => {
           
          }}
        />
      </form>
    </div>
  );
};

export default VoucherUpload;