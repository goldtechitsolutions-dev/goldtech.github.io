import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url }) => {
    const siteTitle = "GoldTech IT Solutions";
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const siteDescription = "Expert IT consulting, AI automation, and Cloud solutions.";
    const metaDescription = description || siteDescription;
    const siteUrl = "https://goldtechitsolutions-dev.github.io/";
    const fullUrl = url ? `${siteUrl}${url}` : siteUrl;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:url" content={fullUrl} />
            {image && <meta property="og:image" content={image} />}

            {/* Twitter */}
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            {image && <meta name="twitter:image" content={image} />}

            {/* Canonical Link to prevent duplicate indexing */}
            <link rel="canonical" href={fullUrl} />
        </Helmet>
    );
};

export default SEO;
