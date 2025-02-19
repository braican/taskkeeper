import {
  Page,
  Text,
  View,
  Image,
  Document,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { moneyFormatter, dateFormatter } from '@/utils';
import { Client, Invoice } from '@/types';

// Register font.
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: '/fonts/Roboto-Light.ttf',
    },
    {
      src: '/fonts/Roboto_Condensed-Bold.ttf',
      fontWeight: 700,
    },
    {
      src: '/fonts/Roboto-Black.ttf',
      fontWeight: 900,
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 32,
    fontFamily: 'Roboto',
  },
  sectionTop: {
    margin: 10,
  },
  section: {
    fontSize: 12,
  },
  smallheader: {
    fontWeight: 700,
    textTransform: 'uppercase',
    color: '#666',
    fontSize: 10.5,
    letterSpacing: 0.4,
    fontFamily: 'Roboto',
  },
  paragraph: {
    marginTop: 5,
    lineHeight: 1,
    fontFamily: 'Roboto',
  },
  dueBox: {
    backgroundColor: '#f28135',
    color: '#ffffff',
    marginLeft: '66.6666667%',
    textAlign: 'right',
    padding: 10,
    marginTop: 40,
    fontFamily: 'Roboto',
  },
  tableRow: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    borderBottom: '1px solid #f8f8f8',
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  descriptionCol: {
    flex: 5,
    paddingRight: 10,
    fontFamily: 'Roboto',
  },
  hrsCol: {
    flex: 2,
    paddingRight: 10,
    fontFamily: 'Roboto',
  },
  rateCol: {
    flex: 2,
    paddingRight: 10,
    fontFamily: 'Roboto',
  },
  costCol: {
    flex: 1.5,
    textAlign: 'right',
    fontFamily: 'Roboto',
  },
});

// Create Document Component
export default function InvoicePdf({
  invoice,
  client,
}: {
  invoice: Invoice;
  client: Client;
}) {
  const invoiceTotal = invoice.tasks.reduce(
    (total, task) => total + task.cost,
    0,
  );

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View>
          <Image style={{ width: 22 }} src="/img/logo.png" />
        </View>
        <View
          style={[
            styles.section,
            {
              marginTop: 20,
              flexDirection: 'row',
            },
          ]}
        >
          <View
            style={{
              paddingRight: 10,
              width: '33.3333333333%',
              flex: '1 0 33.33333333333%',
            }}
          >
            <Text>nick.braica@gmail.com</Text>
            <Text style={styles.paragraph}>860.849.0791</Text>

            <Text style={{ marginTop: 20 }}>4 Moloney Street</Text>
            <Text style={styles.paragraph}>
              West Roxbury, Massachusetts 02132
            </Text>
          </View>
          <View
            style={{
              paddingRight: 10,
              width: '33.3333333333%',
              flex: '1 0 33.33333333333%',
            }}
          >
            {client && (
              <>
                <Text style={styles.smallheader}>Invoice for</Text>
                <Text style={styles.paragraph}>{client.name}</Text>
                <Text style={styles.paragraph}>{client.address}</Text>
              </>
            )}

            <Text style={[styles.smallheader, { marginTop: client ? 20 : 0 }]}>
              Description
            </Text>
            <Text style={[styles.paragraph, { paddingRight: 20 }]}>
              {invoice.description}
            </Text>
          </View>
          <View
            style={{
              paddingRight: 10,
              width: '33.3333333333%',
              flex: '1 0 33.33333333333%',
            }}
          >
            <Text>{invoice.number}</Text>

            <Text style={[styles.smallheader, { marginTop: 20 }]}>Issued</Text>
            <Text style={styles.paragraph}>
              {dateFormatter(invoice.issueDate)}
            </Text>

            <Text style={[styles.smallheader, { marginTop: 20 }]}>Due</Text>
            <Text style={styles.paragraph}>
              {dateFormatter(invoice.dueDate)}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.dueBox}>
            <Text
              style={[
                styles.smallheader,
                { color: '#ffffff', marginBottom: 10 },
              ]}
            >
              Amount Due
            </Text>
            <Text
              style={{ fontSize: 28, fontWeight: 900, fontFamily: 'Roboto' }}
            >
              {moneyFormatter.format(invoiceTotal)}
            </Text>
          </View>

          {invoice.tasks.some((task) => task.hours) ? (
            <View style={{ borderTop: '1px solid #f28135' }}>
              <View
                style={[styles.tableRow, { borderBottom: '1px solid #ccc' }]}
              >
                <Text style={[styles.smallheader, styles.descriptionCol]}>
                  Description
                </Text>
                <Text style={[styles.smallheader, styles.hrsCol]}>Hrs/Qty</Text>
                <Text style={[styles.smallheader, styles.rateCol]}>Rate</Text>
                <Text style={[styles.smallheader, styles.costCol]}>Cost</Text>
              </View>

              {invoice.tasks.map((task) => {
                return (
                  <View style={styles.tableRow} key={task.description}>
                    <Text style={styles.descriptionCol}>
                      {task.description}
                    </Text>
                    <Text style={styles.hrsCol}>{task.hours}</Text>
                    <Text style={styles.rateCol}>
                      {task.hours ? `$${client.rate}/hour` : ''}
                    </Text>
                    <Text style={styles.costCol}>
                      {moneyFormatter.format(task.cost)}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <View
              style={{
                borderTop: '1px solid #f28135',
                marginLeft: '33.3333333%',
              }}
            >
              <View
                style={[styles.tableRow, { borderBottom: '1px solid #ccc' }]}
              >
                <Text style={[styles.smallheader, styles.descriptionCol]}>
                  Description
                </Text>
                <Text style={[styles.smallheader, styles.costCol]}>Cost</Text>
              </View>

              {invoice.tasks.map((task) => (
                <View style={styles.tableRow} key={task.description}>
                  <Text style={styles.descriptionCol}>{task.description}</Text>
                  <Text style={styles.costCol}>
                    {task.cost < 0 ? '(' : ''}
                    {moneyFormatter.format(task.cost)}
                    {task.cost < 0 ? ')' : ''}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
        <View style={[styles.section, { marginLeft: '33.3333333%' }]}>
          <Text style={[styles.smallheader, { marginTop: 20 }]}>
            Payment Information
          </Text>
          <Text style={styles.paragraph}>
            I accept most forms of payment, including PayPal, Venmo (@braican),
            Google Wallet, Bill.com, or a good old-fashioned check made out to
            Nicholas Braica and mailed to the above address. Any questions,
            please don&apos;t hesitate to reach out.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
