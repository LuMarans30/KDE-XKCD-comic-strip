/*
 *   Copyright (C) 2007 Tobias Koenig <tokoe@kde.org>
 *   Copyright (C) 2009 - 2017 Matthias Fuchs <mat69@gmx.net>
 *   Copyright (C) 2019 Hans-Peter Jansen <hpj@urpla.net>
 *   Copyright (C) 2021 Mike Vastola <mike@vasto.la>
 *
 *   This program is free software; you can redistribute it and/or modify
 *   it under the terms of the GNU Library General Public License version 2 as
 *   published by the Free Software Foundation
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details
 *
 *   You should have received a copy of the GNU Library General Public
 *   License along with this program; if not, write to the
 *   Free Software Foundation, Inc.,
 *   51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

// XKCD Comic Provider Plugin

init = () => {
    comic.comicAuthor = "Randall Munroe";
    comic.firstIdentifier = 1;
    comic.shopUrl = "https://store.kde.org/";

    getComic();
}

//Retrieved JSON of current comic
pageRetrieved = (id, data, metadata) => {
    if (id === comic.Image) {
        print("Received comic image data.");
        return;
    }

    try {
        processComic(id, JSON.parse(data));
    } catch (ex) {
        print("Error: " + ex + "\nJSON Parser error " + data)
        comic.error();
        return;
    }
}

processComic = (id, jsonData) => {
    // Boring stuff
    print("json data " + JSON.stringify(jsonData) + " identifier " + id + " last identifier " + jsonData.num + " title " + jsonData.title);

    // Set objects
    comic.title = jsonData.title;
    comic.websiteUrl = `https://xkcd.com/${jsonData.num}`;
    comic.additionalText = jsonData.alt;

    // Requests the actual comic image
    comic.requestPage(jsonData.img, comic.Image);
}

//Gets the latest comic if identifierSpecified is not set, else it gets the comic with the requested number
getComic = () => comic.requestPage(`https://xkcd.com/${comic.identifierSpecified ? comic.identifier : ''}/info.0.json`, comic.Page);