import React from 'react';
import {
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaLinkedin,
    FaYoutube,
    FaTiktok,
    FaWhatsapp,
    FaTelegram,
    FaDiscord,
    FaSnapchat,
    FaPinterest,
    FaReddit,
    FaGlobe
} from 'react-icons/fa';

export const predefinedSocials = [
    { id: 'facebook', name: 'Facebook', icon: FaFacebook, iconRef: 'fab fa-facebook' },
    { id: 'instagram', name: 'Instagram', icon: FaInstagram, iconRef: 'fab fa-instagram' },
    { id: 'twitter', name: 'Twitter/X', icon: FaTwitter, iconRef: 'fab fa-twitter' },
    { id: 'linkedin', name: 'LinkedIn', icon: FaLinkedin, iconRef: 'fab fa-linkedin' },
    { id: 'youtube', name: 'YouTube', icon: FaYoutube, iconRef: 'fab fa-youtube' },
    { id: 'tiktok', name: 'TikTok', icon: FaTiktok, iconRef: 'fab fa-tiktok' },
    { id: 'whatsapp', name: 'WhatsApp', icon: FaWhatsapp, iconRef: 'fab fa-whatsapp' },
    { id: 'telegram', name: 'Telegram', icon: FaTelegram, iconRef: 'fab fa-telegram' },
    { id: 'discord', name: 'Discord', icon: FaDiscord, iconRef: 'fab fa-discord' },
    { id: 'snapchat', name: 'Snapchat', icon: FaSnapchat, iconRef: 'fab fa-snapchat' },
    { id: 'pinterest', name: 'Pinterest', icon: FaPinterest, iconRef: 'fab fa-pinterest' },
    { id: 'reddit', name: 'Reddit', icon: FaReddit, iconRef: 'fab fa-reddit' },
];

export const getSocialIconComponent = (social) => {
    if (!social) return null;
    const desc = (social.description || '').toLowerCase();
    const name = (social.name || '').toLowerCase();
    const icon = (social.icon || '').toLowerCase();
    const link = (social.link || social.url || '').toLowerCase();

    const match = predefinedSocials.find(s => {
        const id = s.id.toLowerCase();
        const sName = s.name.toLowerCase();
        return (
            desc === sName ||
            name === sName ||
            icon === s.iconRef.toLowerCase() ||
            icon.includes(id) ||
            desc.includes(id) ||
            name.includes(id) ||
            link.includes(id)
        );
    });

    return match ? match.icon : null;
};

export const SocialIcon = ({ social, className = '', fallbackClassName = '' }) => {
    const IconComponent = getSocialIconComponent(social);
    if (IconComponent) {
        return <IconComponent className={className} />;
    }
    return <i className={`${social?.icon || 'fab fa-globe'} ${fallbackClassName || className}`} />;
};

export default SocialIcon;