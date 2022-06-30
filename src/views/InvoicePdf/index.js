import React from 'react';
import { Page, Text, View, Image, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register font.
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: './static/fonts/Roboto-Light.ttf',
    },
    {
      src: './static/fonts/RobotoCondensed-Bold.ttf',
      fontWeight: 700,
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 32,
  },
  sectionTop: {
    margin: 10,
  },
  section: {
    fontFamily: 'Roboto',
    fontSize: 12,
  },
  col: {
    flex: '1 0 33%',
    width: '33%',
  },
  smallheader: {
    fontFamily: 'Roboto',
    fontWeight: 700,
    textTransform: 'uppercase',
    color: '#666',
    fontSize: 10.5,
    letterSpacing: 0.4,
  },
  paragraph: {
    marginTop: 5,
    lineHeight: 1.5,
  },
});

// Create Document Component
const InvoicePdf = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <Image style={{ width: 22 }} src="./static/img/logo.png" />
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
          <Text style={styles.paragraph}>Studio Rd.</Text>

          <Text style={[styles.smallheader, { marginTop: 20 }]}>Invoice for</Text>
          <Text style={styles.paragraph}>Minds.ai</Text>
        </View>
        <View style={[styles.col, { paddingRight: 10 }]}>
          <Text>SRD-0013</Text>

          <Text style={[styles.smallheader, { marginTop: 20 }]}>Issued</Text>
          <Text style={styles.paragraph}>5/10/2022</Text>

          <Text style={[styles.smallheader, { marginTop: 20 }]}>Due</Text>
          <Text style={styles.paragraph}>6/9/2022</Text>
        </View>
      </View>
      <View style={{ flex: 1 }}>Payment info here</View>
      <View style={[styles.section, { marginLeft: '33%' }]}>
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

export default InvoicePdf;
