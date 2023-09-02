'use client'

import CheckoutWizard from '@/components/CheckoutWizard'
import { saveShippingAddress } from '@/redux/slices/cartSlice'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

export default function ShippingAddressPage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm()
  const router = useRouter()
  const dispatch = useDispatch()
  const { shippingAddress } = useSelector((state) => state.cart)

  useEffect(() => {
    setValue('fullName', shippingAddress.fullName)
    setValue('address', shippingAddress.address)
    setValue('city', shippingAddress.city)
    setValue('postalCode', shippingAddress.postalCode)
    setValue('country', shippingAddress.country)
  }, [setValue, shippingAddress])

  const submitHandler = async ({ fullName, address, city, postalCode, country }) => {
    try {
      const url = 'http://127.0.0.1:8000/clients/';
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };

      const clientData = {
        nombre_razon_social: "Erick",
        codigo_tipo_documento_identidad: 1, // Replace with actual code
        numero_documento: 33888993 // Replace with actual document number
      };

      // Send the form data to the backend using axios
      const response = await axios.post(url, clientData, { headers });
      console.log('Client created with ID:', response.data.id);

      dispatch(
          saveShippingAddress({ fullName, address, city, postalCode, country })
      )
      router.push('/payment');
    } catch (error) {
      console.error('Error creating client:', error);
    }
  }
  return (
    <div>
      <CheckoutWizard activeStep={1} />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Datos del Cliente</h1>
        <div className="mb-4">
          <label htmlFor="fullName">Nombre o Razón Social</label>
          <input
            className="w-full"
            id="fullName"
            autoFocus
            {...register('fullName', {
              required: 'Por favor escriba su nombre',
            })}
          />
          {errors.fullName && (
            <div className="text-red-500">{errors.fullName.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="address">Email</label>
          <input
            className="w-full"
            id="address"
            type="email"
            {...register('address', {
              required: 'Por favor escriba su correo electrónico',
              minLength: {
                value: 3,
                message: 'Debe contener más de dos caracteres',
              },
            })}
          />
          {errors.address && (
            <div className="text-red-500">{errors.address.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="city">Complemento</label>
          <input
            className="w-full"
            id="city"
            {...register('city', {
            })}
          />
          {errors.city && (
            <div className="text-red-500 ">{errors.city.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="postalCode">Numero de Documento</label>
          <input
            className="w-full"
            id="postalCode"
            type="number"
            {...register('postalCode', {
              required: 'Por favor escriba el numero de documento.',
            })}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="country">Tipo de Documento</label>
          <input
              className="w-full"
              id="country"
              {...register('country', {
                required: 'Escriba el tipo de documento',
              })}
          />
          {errors.country && (
              <div className="text-red-500 ">{errors.country.message}</div>
          )}
        </div>
        <div className="mb-4 flex justify-between">
          <button className="primary-button">Registrar</button>
        </div>
      </form>
    </div>
  )
}
