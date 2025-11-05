import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Label } from '../../components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { toast } from 'sonner'
import { paymentService, type Payment, type PaymentMethod } from '../../service/payment/paymentService'
import { invoiceService, type Invoice } from '../../services/invoiceService'

export function PaymentFormPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEdit)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('')
  const [invoiceBalance, setInvoiceBalance] = useState<number>(0)

  // Form fields
  const [method, setMethod] = useState<PaymentMethod>('CASH')
  const [amount, setAmount] = useState<number>(0)
  const [paymentDate, setPaymentDate] = useState<string>(
    new Date().toISOString().slice(0, 16)
  )
  const [reference, setReference] = useState<string>('')
  const [notes, setNotes] = useState<string>('')

  useEffect(() => {
    loadInvoices()
    if (isEdit && id) {
      loadPayment(id)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, id])

  useEffect(() => {
    if (selectedInvoiceId) {
      loadInvoiceDetails(selectedInvoiceId)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInvoiceId])

  const loadInvoices = async () => {
    try {
      const data = await invoiceService.getAll()
      setInvoices(data)
    } catch (error) {
      console.error('Error loading invoices:', error)
      toast.error('Error al cargar las facturas')
    }
  }

  const loadInvoiceDetails = async (invoiceId: string) => {
    try {
      // Calcular saldo pendiente
      const balance = await paymentService.getBalanceByInvoice(invoiceId)
      setInvoiceBalance(balance)

      // Si es un nuevo pago, sugerir el monto del saldo
      if (!isEdit && balance > 0) {
        setAmount(balance)
      }
    } catch (error) {
      console.error('Error loading invoice details:', error)
      toast.error('Error al cargar los detalles de la factura')
    }
  }

  const loadPayment = async (paymentId: string) => {
    try {
      setInitialLoading(true)
      const payment: Payment = await paymentService.getById(paymentId)

      setMethod(payment.method)
      setAmount(payment.amount)
      setSelectedInvoiceId(payment.invoiceId)
      setPaymentDate(
        new Date(payment.paymentDate || payment.createdAt)
          .toISOString()
          .slice(0, 16)
      )
      setReference(payment.reference || '')
      setNotes(payment.notes || '')
    } catch (error) {
      console.error('Error loading payment:', error)
      toast.error('Error al cargar el pago')
      navigate('/payments')
    } finally {
      setInitialLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedInvoiceId) {
      toast.error('Debe seleccionar una factura')
      return
    }

    if (amount <= 0) {
      toast.error('El monto debe ser mayor a 0')
      return
    }

    // Validar que el monto no exceda el saldo
    if (invoiceBalance > 0 && amount > invoiceBalance && !isEdit) {
      toast.error(
        `El monto excede el saldo pendiente de $${invoiceBalance.toFixed(2)}`
      )
      return
    }

    try {
      setLoading(true)

      const data = {
        method,
        amount,
        invoiceId: selectedInvoiceId,
        paymentDate: new Date(paymentDate).toISOString(),
        reference: reference || undefined,
        notes: notes || undefined,
      }

      if (isEdit && id) {
        await paymentService.update(id, data)
        toast.success('Pago actualizado correctamente')
      } else {
        await paymentService.create(data)
        toast.success('Pago registrado correctamente')
      }

      navigate('/payments')
    } catch (error: unknown) {
      console.error('Error saving payment:', error)
      const axiosError = error as { response?: { data?: { message?: string } } }
      toast.error(
        axiosError.response?.data?.message || 'Error al guardar el pago'
      )
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/payments')}
          className="mb-4"
        >
          <ArrowLeft className="size-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold">
          {isEdit ? 'Editar Pago' : 'Registrar Nuevo Pago'}
        </h1>
        <p className="text-muted-foreground">
          {isEdit
            ? 'Actualiza la información del pago'
            : 'Completa el formulario para registrar un nuevo pago'}
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información del Pago */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Información del Pago</CardTitle>
              <CardDescription>Datos principales del pago</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Factura */}
              <div className="space-y-2">
                <Label htmlFor="invoiceId">Factura *</Label>
                <Select
                  value={selectedInvoiceId}
                  onValueChange={setSelectedInvoiceId}
                  disabled={isEdit}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar factura" />
                  </SelectTrigger>
                  <SelectContent>
                    {invoices.map((invoice) => (
                      <SelectItem key={invoice.id} value={invoice.id}>
                        {invoice.number} - {invoice.company?.businessName} - $
                        {invoice.totalAmount.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedInvoiceId && (
                  <p className="text-sm text-muted-foreground">
                    Saldo pendiente: ${invoiceBalance.toFixed(2)}
                  </p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Método de Pago */}
                <div className="space-y-2">
                  <Label htmlFor="method">Método de Pago *</Label>
                  <Select
                    value={method}
                    onValueChange={(value) => setMethod(value as PaymentMethod)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar método" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentService.getPaymentMethods().map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Monto */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Monto *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Fecha de Pago */}
                <div className="space-y-2">
                  <Label htmlFor="paymentDate">Fecha de Pago</Label>
                  <Input
                    id="paymentDate"
                    type="datetime-local"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                  />
                </div>

                {/* Referencia */}
                <div className="space-y-2">
                  <Label htmlFor="reference">Referencia</Label>
                  <Input
                    id="reference"
                    placeholder="Nro. de operación, cheque, etc."
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Número de transacción, cheque, etc.
                  </p>
                </div>
              </div>

              {/* Notas */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  placeholder="Información adicional sobre el pago..."
                  className="min-h-[100px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Botones de Acción */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-4 justify-end"
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/payments')}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="size-4 mr-2" />
                {isEdit ? 'Actualizar' : 'Registrar'} Pago
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </div>
  )
}

