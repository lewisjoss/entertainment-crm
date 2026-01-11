import Layout from '../components/Layout'
import Card from '../components/Card'
import StatusBadge from '../components/StatusBadge'
import Button from '../components/Button'

export default function InvoicesPage() {
  // This would be populated from API in real implementation
  const invoices = [
    {
      id: '1',
      invoiceNumber: 'INV-2024-00001',
      title: 'Wedding - Smith & Jones',
      company: { name: 'XYZ Events' },
      invoiceDate: '2024-01-01',
      dueDate: '2024-01-15',
      total: 2500,
      amountPaid: 1250,
      amountDue: 1250,
      status: 'PARTIAL',
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-00002',
      title: 'Corporate Event - ABC Ltd',
      company: { name: 'Corporate Ltd' },
      invoiceDate: '2024-01-02',
      dueDate: '2024-01-16',
      total: 1800,
      amountPaid: 0,
      amountDue: 1800,
      status: 'SENT',
      overdue: false,
    },
    {
      id: '3',
      invoiceNumber: 'INV-2023-00150',
      title: 'New Year Party',
      company: { name: 'Event Company' },
      invoiceDate: '2023-12-20',
      dueDate: '2024-01-03',
      total: 2000,
      amountPaid: 0,
      amountDue: 2000,
      status: 'OVERDUE',
      overdue: true,
    },
  ]

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
            <p className="mt-1 text-sm text-gray-500">Manage your invoicing and payments</p>
          </div>
          <Button>New Invoice</Button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <p className="text-sm font-medium text-gray-500">Total Outstanding</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">£5,050</p>
          </Card>
          <Card>
            <p className="text-sm font-medium text-gray-500">Overdue</p>
            <p className="mt-1 text-2xl font-semibold text-red-600">£2,000</p>
          </Card>
          <Card>
            <p className="text-sm font-medium text-gray-500">This Month</p>
            <p className="mt-1 text-2xl font-semibold text-green-600">£4,300</p>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select className="input">
                <option value="">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="SENT">Sent</option>
                <option value="PARTIAL">Partial</option>
                <option value="PAID">Paid</option>
                <option value="OVERDUE">Overdue</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <input type="date" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input type="text" placeholder="Search invoices..." className="input" />
            </div>
          </div>
        </Card>

        {/* Invoices list */}
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id} hover className={invoice.overdue ? 'border-l-4 border-red-500' : ''}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{invoice.title}</h3>
                    <StatusBadge status={invoice.status} />
                    <span className="text-sm text-gray-500">#{invoice.invoiceNumber}</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Company:</span> {invoice.company.name}
                    </p>
                    <p>
                      <span className="font-medium">Invoice Date:</span>{' '}
                      {new Date(invoice.invoiceDate).toLocaleDateString('en-GB')}
                    </p>
                    <p>
                      <span className="font-medium">Due Date:</span>{' '}
                      {new Date(invoice.dueDate).toLocaleDateString('en-GB')}
                      {invoice.overdue && (
                        <span className="ml-2 text-red-600 font-semibold">OVERDUE</span>
                      )}
                    </p>
                    <div className="flex gap-4 mt-2">
                      <p>
                        <span className="font-medium">Total:</span> £{invoice.total.toLocaleString()}
                      </p>
                      <p>
                        <span className="font-medium">Paid:</span> £{invoice.amountPaid.toLocaleString()}
                      </p>
                      <p>
                        <span className="font-medium">Due:</span> £{invoice.amountDue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <Button variant="secondary" size="sm">View</Button>
                  <Button size="sm">Send</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}
