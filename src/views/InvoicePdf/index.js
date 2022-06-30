import React from 'react';
import PropTypes from 'prop-types';
import { Page, Text, View, Image, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { currencyFormatterFull, formatDate } from 'util/index';

// Register font.
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: '/static/fonts/Roboto-Light.ttf',
    },
    {
      src: '/static/fonts/RobotoCondensed-Bold.ttf',
      fontWeight: 700,
    },
    {
      src: '/static/fonts/Roboto-Black.ttf',
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
  col: {
    flex: '1 0 33.3333333%',
    width: '33.3333333%',
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
    lineHeight: 1.5,
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
const InvoicePdf = ({ invoice, client }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <Image style={{ width: 22 }} src="/static/img/logo.png" />
      </View>
      <View
        style={[
          styles.section,
          {
            marginTop: 20,
            flexDirection: 'row',
          },
        ]}>
        <View style={[styles.col, { paddingRight: 10 }]}>
          <Text>nick.braica@gmail.com</Text>
          <Text style={styles.paragraph}>860.849.0791</Text>

          <Text style={{ marginTop: 20 }}>2316 SE 52nd Avenue</Text>
          <Text style={styles.paragraph}>Portland, Oregon 97215</Text>
        </View>
        <View style={[styles.col, { paddingRight: 10 }]}>
          <Text style={styles.smallheader}>Invoice for</Text>
          <Text style={styles.paragraph}>{client}</Text>

          <Text style={[styles.smallheader, { marginTop: 20 }]}>Description</Text>
          <Text style={styles.paragraph}>{invoice.description}</Text>
        </View>
        <View style={[styles.col]}>
          <Text>{invoice.invoiceId}</Text>

          <Text style={[styles.smallheader, { marginTop: 20 }]}>Issued</Text>
          <Text style={styles.paragraph}>{formatDate(invoice.issued)}</Text>

          <Text style={[styles.smallheader, { marginTop: 20 }]}>Due</Text>
          <Text style={styles.paragraph}>{formatDate(invoice.due)}</Text>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.dueBox}>
          <Text style={[styles.smallheader, { color: '#ffffff', marginBottom: 10 }]}>
            Amount Due
          </Text>
          <Text style={{ fontSize: 28, fontWeight: 900, fontFamily: 'Roboto' }}>
            {currencyFormatterFull.format(invoice.total)}
          </Text>
        </View>

        {invoice.tasks.some(t => t.hours) ? (
          <View style={{ borderTop: '1px solid #f28135' }}>
            <View style={[styles.tableRow, { borderBottom: '1px solid #ccc' }]}>
              <Text style={[styles.smallheader, styles.descriptionCol]}>Description</Text>
              <Text style={[styles.smallheader, styles.hrsCol]}>Hrs/Qty</Text>
              <Text style={[styles.smallheader, styles.rateCol]}>Rate</Text>
              <Text style={[styles.smallheader, styles.costCol]}>Cost</Text>
            </View>

            {invoice.tasks.map(t => {
              let cost = '';

              if (t.hours) {
                cost = currencyFormatterFull.format(parseFloat(t.hours) * parseFloat(invoice.rate));
              } else {
                cost =
                  parseFloat(t.price) < 0
                    ? `(${currencyFormatterFull.format(Math.abs(t.price))})`
                    : currencyFormatterFull.format(t.price);
              }

              return (
                <View style={styles.tableRow} key={t.id}>
                  <Text style={styles.descriptionCol}>{t.description}</Text>
                  <Text style={styles.hrsCol}>{t.hours}</Text>
                  <Text style={styles.rateCol}>{t.hours ? `$${invoice.rate}/hour` : ''}</Text>
                  <Text style={styles.costCol}>{cost}</Text>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={{ borderTop: '1px solid #f28135', marginLeft: '33.3333333%' }}>
            <View style={[styles.tableRow, { borderBottom: '1px solid #ccc' }]}>
              <Text style={[styles.smallheader, styles.descriptionCol]}>Description</Text>
              <Text style={[styles.smallheader, styles.costCol]}>Cost</Text>
            </View>

            {invoice.tasks.map(t => (
              <View style={styles.tableRow} key={t.id}>
                <Text style={styles.descriptionCol}>{t.description}</Text>
                <Text style={styles.costCol}>
                  {parseFloat(t.price) < 0
                    ? `(${currencyFormatterFull.format(Math.abs(t.price))})`
                    : currencyFormatterFull.format(t.price)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <View style={[styles.section, { marginLeft: '33.3333333%' }]}>
        <Text style={[styles.smallheader, { marginTop: 20 }]}>Payment Information</Text>
        <Text style={styles.paragraph}>
          I accept most forms of payment, including PayPal, Venmo (@braican), Google Wallet,
          Bill.com, or a good old-fashioned check made out to Nicholas Braica and mailed to the
          above address. Any questions, please don't hesitate to reach out.
        </Text>
      </View>
    </Page>
  </Document>
);

InvoicePdf.propTypes = {
  invoice: PropTypes.shape({
    total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    invoiceId: PropTypes.string,
    issued: PropTypes.string,
    due: PropTypes.string,
    description: PropTypes.string,
    tasks: PropTypes.array,
  }),
  client: PropTypes.string,
};

export default InvoicePdf;
