'use client'
import CheckoutWizard from '@/components/CheckoutWizard'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import React, { useState } from 'react';
import axios from 'axios'; // Import Axios


export default function PlaceOrderScreen() {
    const {
        cartItems,
        itemsPrice,
        shippingPrice,
        totalPrice,
        taxPrice,
        shippingAddress,
        paymentMethod,
        loading,
    } = useSelector((state) => state.cart)

    const actividadEconomica = "862010";
    const codigoProductoSin = 99100;
    const codigoProducto = "P6";
    const descripcion = "Examen General";
    const unidadMedida = 58;
    const precioUnitario = 65.0; // Set the fixed value of 65.0
    const montoDescuento = 0.0;
    const especialidad = "Traumatologia";
    const especialidadDetalle = "string";
    const nroQuirofanoSalaOperaciones = 1;
    const especialidadMedico = "string";
    const nombreApellidoMedico = "Medicmel";
    const nitDocumentoMedico = 392010028;
    const nroMatriculaMedico = "string";
    const nroFacturaMedico = 1;

    // Calculate the values based on cartItems
    const cantidad = cartItems.reduce((total, item) => total + item.qty, 0);
    const subTotal = itemsPrice;
    const monto_total_moneda = itemsPrice;
    const monto_total = itemsPrice;
    const monto_total_sujeto_iva = itemsPrice;

    // Define the params object
    const params = {
        codigo_metodo_pago: 1,
        monto_total: itemsPrice,
        monto_total_sujeto_iva: itemsPrice,
        codigo_moneda: 1,
        tipo_cambio: 1,
        monto_total_moneda: itemsPrice,
        monto_gift_card: 0.0,
        descuento_adicional: 0.0,
        leyenda: "string",
        usuario: "string",
    };
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [discounts, setDiscounts] = useState({});


    const handleItemDiscountChange = (itemId, discountValue) => {
        setDiscounts((prevDiscounts) => ({
            ...prevDiscounts,
            [itemId]: parseFloat(discountValue),
        }));
    };

    const calculateUpdatedSubtotal = () => {
        let updatedSubtotal = 0;
        cartItems.forEach((item) => {
            const discount = discounts[item.id] || 0;
            updatedSubtotal += item.qty * item.price - discount;
        });
        return updatedSubtotal.toFixed(2);
    };

    const [additionalDiscount, setAdditionalDiscount] = useState(0);

// Function to update the additional discount
    const handleAdditionalDiscountChange = (value) => {
        setAdditionalDiscount(parseFloat(value));
    };

    const router = useRouter()

    useEffect(() => {
        if (!paymentMethod) {
            router.push('/payment')
        }
    }, [paymentMethod, router])

    const handleEnviarFactura = () => {
        setIsSubmitting(true);

        // Construct the JSON object as previously shown
        const jsonObject = {
            details: [
                {
                    actividadEconomica,
                    codigoProductoSin,
                    codigoProducto,
                    descripcion,
                    cantidad,
                    unidadMedida,
                    precioUnitario,
                    montoDescuento,
                    subTotal,
                    especialidad,
                    especialidadDetalle,
                    nroQuirofanoSalaOperaciones,
                    especialidadMedico,
                    nombreApellidoMedico,
                    nitDocumentoMedico,
                    nroMatriculaMedico,
                    nroFacturaMedico,
                },
            ],
            params,
        };

        axios
            .post(
                'http://192.168.1.4:8000/invoices/emit/hospital_clinic?customer_id=3&client_id=6&is_offline=0',
                jsonObject,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json', // Add the Accept header
                    },
                }
            )
            .then((response) => {
                if (response.status === 200) {
                    // Successfully sent the invoice
                    alert('Invoice sent successfully!');
                } else {
                    // Handle the error
                    alert('Failed to send invoice. Please try again.');
                }
            })
            .catch((error) => {
                console.error('Error sending invoice:', error);
                alert('An error occurred while sending the invoice. Please try again later.');
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <div>
                <CheckoutWizard activeStep={3} />
            <h1 className="mb-4 text-xl">Emitir Factura</h1>
            {loading ? (
                <div>Loading</div>
            ) : cartItems.length === 0 ? (
                <div>
                    Cart is empty. <Link href="/">Hacer venta</Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-4 md:gap-5">
                    <div className="overflow-x-auto md:col-span-3">
                        <div className="card  p-5">
                            <h2 className="mb-2 text-lg">Datos del cliente</h2>
                            <div>
                                {shippingAddress.fullName}, {shippingAddress.address},{' '}
                                {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                                {shippingAddress.country}
                            </div>
                            <div>
                                <Link className="default-button inline-block" href="/shipping">
                                    Editar
                                </Link>
                            </div>
                        </div>
                        <div className="card  p-5">
                            <h2 className="mb-2 text-lg">Método de Pago</h2>
                            <div>{paymentMethod}</div>
                            <div>
                                <Link className="default-button inline-block" href="/payment">
                                    Editar
                                </Link>
                            </div>
                        </div>
                        <div className="card overflow-x-auto p-5">
                            <h2 className="mb-2 text-lg">Artículos de venta</h2>
                            <table className="min-w-full">
                                <thead className="border-b">
                                <tr>
                                    <th className="px-5 text-left">Artículo</th>
                                    <th className="    p-5 text-right">Cantidad</th>
                                    <th className="  p-5 text-right">Precio</th>
                                    <th className= "  p-5 text-right">Descuento</th>
                                    <th className="p-5 text-right">Subtotal</th>
                                </tr>
                                </thead>
                                <tbody>
                                {cartItems.map((item) => (
                                    <tr key={item.id} className="border-b">
                                        <td>
                                            <Link
                                                href={`/product/${item.id}`}
                                                className="flex items-center"
                                            >
                                                {item.name}
                                            </Link>
                                        </td>
                                        <td className=" p-5 text-right">{item.qty}</td>
                                        <td className="p-5 text-right">${item.price}</td>
                                        <td className="p-5 text-right">
                                            <input
                                                type="number"
                                                value={discounts[item.id] || ''}
                                                onChange={(e) => handleItemDiscountChange(item.id, e.target.value)}
                                                placeholder="Discount"
                                                className="w-16 border rounded p-1 text-right"
                                            />
                                        </td>
                                        <td className="p-5 text-right">
                                            ${(item.qty * item.price - (discounts[item.id] || 0)).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <div>
                                <Link className="default-button inline-block" href="/cart">
                                    Editar
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card  p-5">
                            <h2 className="mb-2 text-lg">Resumen de Facturación</h2>
                            <ul>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>SubTotal</div>
                                        <div>${calculateUpdatedSubtotal()}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>Descuento Adicional</div>
                                        <div>
                                            <input
                                                type="number"
                                                value={additionalDiscount}
                                                onChange={(e) => handleAdditionalDiscountChange(e.target.value)}
                                                placeholder="Descuento Adicional"
                                                className="w-16 border rounded p-1 text-right"
                                            />
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>SubTotal con Descuento</div>
                                        <div>${(calculateUpdatedSubtotal() - additionalDiscount).toFixed(2)}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>Monto Total</div>
                                        <div>${(calculateUpdatedSubtotal() - additionalDiscount).toFixed(2)}</div>
                                    </div>
                                </li>
                                <li>
                                    <button
                                        onClick={handleEnviarFactura}
                                        className="primary-button w-full"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Enviando Factura...' : 'Enviar Factura'}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
