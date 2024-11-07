"use client"

import * as React from "react"
import { Clock, FileText, Home, Package, Plus, Receipt, Save, Settings, Timer, Users, Star, Camera, CheckSquare, AlertTriangle, Trash2, Wrench, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const partsData = [
  { id: 1, name: "HEPA Neutralizer", price: 29.99 },
  { id: 2, name: "Water Basin", price: 49.99 },
  { id: 3, name: "Power Nozzle Belt", price: 9.99 },
  { id: 4, name: "Main Brush Roll", price: 39.99 },
]

export default function WorkOrder() {
  const [selectedParts, setSelectedParts] = React.useState<Array<{ id: number; name: string; price: number; quantity: number }>>([])
  const [laborTime, setLaborTime] = React.useState(0)
  const [isTimerRunning, setIsTimerRunning] = React.useState(false)
  const [startTime, setStartTime] = React.useState<Date | null>(null)
  const [laborRate] = React.useState(85) // $85/hour labor rate
  const [customerRating, setCustomerRating] = React.useState(0)
  const [showPowerNozzleSerial, setShowPowerNozzleSerial] = React.useState(false)
  const [showAquaMateSerial, setShowAquaMateSerial] = React.useState(false)
  const [showMiniJetSerial, setShowMiniJetSerial] = React.useState(false)

  React.useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && startTime) {
      interval = setInterval(() => {
        const elapsed = (new Date().getTime() - startTime.getTime()) / (1000 * 60 * 60)
        setLaborTime(elapsed)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, startTime])

  const toggleTimer = () => {
    if (!isTimerRunning) {
      setStartTime(new Date())
    }
    setIsTimerRunning(!isTimerRunning)
  }

  const addPart = (partId: string) => {
    const part = partsData.find(p => p.id.toString() === partId)
    if (part) {
      setSelectedParts(prev => {
        const existing = prev.find(p => p.id === part.id)
        if (existing) {
          return prev.map(p =>
            p.id === part.id ? { ...p, quantity: p.quantity + 1 } : p
          )
        }
        return [...prev, { ...part, quantity: 1 }]
      })
    }
  }

  const updateQuantity = (partId: number, quantity: number) => {
    setSelectedParts(prev =>
      prev.map(p => (p.id === partId ? { ...p, quantity } : p))
    )
  }

  const removePart = (partId: number) => {
    setSelectedParts(prev => prev.filter(p => p.id !== partId))
  }

  const calculateTotal = () => {
    const partsTotal = selectedParts.reduce((sum, part) => sum + part.price * part.quantity, 0)
    const laborTotal = laborTime * laborRate
    return (partsTotal + laborTotal).toFixed(2)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white p-6">
        <nav className="space-y-8">
          <div className="flex items-center space-x-2">
            <Wrench className="w-6 h-6" />
            <span className="text-xl font-semibold whitespace-nowrap">Rainbow Workshop</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 bg-gray-800 p-2 rounded">
              <FileText className="w-5 h-5" />
              <span>Work Orders</span>
            </div>
            <div className="flex items-center space-x-2 p-2">
              <Users className="w-5 h-5" />
              <span>Customers</span>
            </div>
            <div className="flex items-center space-x-2 p-2">
              <Package className="w-5 h-5" />
              <span>Inventory</span>
            </div>
            <div className="flex items-center space-x-2 p-2">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </div>
          </div>
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Work Order #WO-2024-001</CardTitle>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              New Work Order
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="customer">Customer</TabsTrigger>
                <TabsTrigger value="machine">Rainbow</TabsTrigger>
                <TabsTrigger value="service">Service</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="workOrderId">Work Order ID</Label>
                    <Input id="workOrderId" value="WO-2024-001" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceType">Service Type</Label>
                    <Select>
                      <SelectTrigger id="serviceType">
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="repair">Repair</SelectItem>
                        <SelectItem value="warranty">Warranty Check</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="creationDate">Creation Date</Label>
                    <Input id="creationDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input id="dueDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="inProgress">In Progress</SelectItem>
                        <SelectItem value="awaitingParts">Awaiting Parts</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select>
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency</Label>
                    <Select>
                      <SelectTrigger id="urgency">
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="customer">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name</Label>
                    <Input id="customerName" placeholder="Enter customer name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerId">Customer ID</Label>
                    <Input id="customerId" placeholder="Enter customer ID" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input id="contactNumber" placeholder="Enter contact number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter email address" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="address">Service Location Address</Label>
                    <Textarea id="address" placeholder="Enter service address" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredContact">Preferred Contact Method</Label>
                    <Select>
                      <SelectTrigger id="preferredContact">
                        <SelectValue placeholder="Select contact method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="machine">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rainbowModel">Rainbow Model</Label>
                    <Select>
                      <SelectTrigger id="rainbowModel">
                        <SelectValue placeholder="Select Rainbow model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="srx">SRX</SelectItem>
                        <SelectItem value="e2Black">E2 Black (E2 Type 12)</SelectItem>
                        <SelectItem value="e2Gold">E2 Gold (E2 Type 12)</SelectItem>
                        <SelectItem value="e2Series">E-2 (e SERIES)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serialNumber">Rainbow Serial Number</Label>
                    <Input id="serialNumber" placeholder="Enter Rainbow serial number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate">Date of Purchase</Label>
                    <Input id="purchaseDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="machineCondition">Rainbow Condition</Label>
                    <Select>
                      <SelectTrigger id="machineCondition">
                        <SelectValue placeholder="Select Rainbow condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4 mt-4">
                  <Label>Attachments Left with Rainbow</Label>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="powerNozzle" onCheckedChange={(checked) => setShowPowerNozzleSerial(checked === true)} />
                        <Label htmlFor="powerNozzle">Power Nozzle</Label>
                      </div>
                      {showPowerNozzleSerial && (
                        <Input placeholder="Enter Power Nozzle serial number" className="mt-2" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="aquaMate" onCheckedChange={(checked) => setShowAquaMateSerial(checked === true)} />
                        <Label htmlFor="aquaMate">AquaMate</Label>
                      </div>
                      {showAquaMateSerial && (
                        <Input placeholder="Enter AquaMate serial number" className="mt-2" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="miniJet" onCheckedChange={(checked) => setShowMiniJetSerial(checked === true)} />
                        <Label htmlFor="miniJet">MiniJet</Label>
                      </div>
                      {showMiniJetSerial && (
                        <Input placeholder="Enter MiniJet serial number" className="mt-2" />
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="service">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reportedIssue">Reported Issue</Label>
                      <Textarea id="reportedIssue" placeholder="Describe the reported issue" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="symptomsObserved">Symptoms Observed</Label>
                      <Textarea id="symptomsObserved" placeholder="List observed symptoms" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="severityLevel">Severity Level</Label>
                      <Select>
                        <SelectTrigger id="severityLevel">
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assignedTechnician">Assigned Technician</Label>
                      <Input id="assignedTechnician" placeholder="Enter technician name" />
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <Label>Parts and Labor</Label>
                    <div className="flex gap-4">
                      <Select onValueChange={addPart}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Add part" />
                        </SelectTrigger>
                        <SelectContent>
                          {partsData.map(part => (
                            <SelectItem key={part.id} value={part.id.toString()}>
                              {part.name} - ${part.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="icon" onClick={() => addPart(partsData[0].id.toString())}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Part Name</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedParts.map(part => (
                          <TableRow key={part.id}>
                            <TableCell>{part.name}</TableCell>
                            <TableCell>${part.price}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={part.quantity}
                                onChange={e => updateQuantity(part.id, parseInt(e.target.value))}
                                className="w-20"
                                min="1"
                              />
                            </TableCell>
                            <TableCell>${(part.price * part.quantity).toFixed(2)}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removePart(part.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="flex items-center gap-4">
                      <Button onClick={toggleTimer} variant="outline">
                        {isTimerRunning ? <Timer className="mr-2" /> : <Clock className="mr-2" />}
                        {isTimerRunning ? "Stop Timer" : "Start Timer"}
                      </Button>
                      <div className="text-2xl font-mono">
                        {laborTime.toFixed(2)} hours
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Labor Rate: ${laborRate}/hour
                    </div>
                    <div className="text-lg">
                      Labor Total: ${(laborTime * laborRate).toFixed(2)}
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="technicianNotes">Technician Notes</Label>
                    <Textarea id="technicianNotes" placeholder="Enter detailed notes about the service" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline">
                      <Camera className="mr-2 h-4 w-4" />
                      Upload Photos
                    </Button>
                    <Button variant="outline">
                      <CheckSquare className="mr-2 h-4 w-4" />
                      Complete Checklist
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="billing">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Invoice Summary</h3>
                    <div className="space-y-2">
                      {selectedParts.map(part => (
                        <div key={part.id} className="flex justify-between text-sm">
                          <span>{part.name} x{part.quantity}</span>
                          <span>${(part.price * part.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <Separator />
                      <div className="flex justify-between text-sm">
                        <span>Labor ({laborTime.toFixed(2)} hours @ ${laborRate}/hour)</span>
                        <span>${(laborTime * laborRate).toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>${calculateTotal()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="invoiceId">Invoice ID</Label>
                      <Input id="invoiceId" placeholder="Enter invoice ID" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentStatus">Payment Status</Label>
                      <Select>
                        <SelectTrigger id="paymentStatus">
                          <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unpaid">Unpaid</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="partiallyPaid">Partially Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Customer Signature</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      [Signature Pad Placeholder]
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerFeedback">Customer Feedback</Label>
                    <Textarea id="customerFeedback" placeholder="Enter customer feedback" />
                  </div>
                  <div className="space-y-2">
                    <Label>Customer Rating</Label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-6 h-6 cursor-pointer ${star <= customerRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          onClick={() => setCustomerRating(star)}
                        />
                      ))}
                    </div>
                  </div>
                  <Button className="w-full">
                    <Receipt className="mr-2 h-4 w-4" />
                    Generate Invoice
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="summary">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Customer Work Order Summary</h3>
                  <div className="border rounded-lg p-4">
                    <p>This section will contain a summary of the work order, including customer details, Rainbow model information, reported issues, services performed, parts used, labor time, and total cost.</p>
                  </div>
                  <Button className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Document
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Work Order
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}