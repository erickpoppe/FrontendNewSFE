'use client'

import CheckoutWizard from '@/components/CheckoutWizard'
import { saveShippingAddress } from '@/redux/slices/cartSlice'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'

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

  const submitHandler = ({ fullName, address, city, postalCode, country }) => {
    dispatch(
      saveShippingAddress({ fullName, address, city, postalCode, country })
    )

    router.push('/payment')
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
