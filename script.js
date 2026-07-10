(() => {
    const redirectedPath = sessionStorage.getItem("altkalkis:redirect");
    if (!redirectedPath) return;
    sessionStorage.removeItem("altkalkis:redirect");

    try {
        const redirectUrl = new URL(redirectedPath, window.location.origin);
        const nextPath = `${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`;
        const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        if (nextPath && nextPath !== currentPath) {
            window.history.replaceState({ restoredFrom404: true }, "", nextPath);
        }
    } catch {
        // Ignorer ugyldig redirect-verdi.
    }
})();

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM er lastet");

    const menuBtn = document.querySelector(".topbar__menu");
    const sidebar = document.getElementById("sidebarDrawer");
    const backdrop = document.querySelector("[data-drawer-backdrop]");
    const mobilePanelBtn = document.querySelector("[data-mobile-panel-toggle]");
    const sidebarToggleSection = document.getElementById("sidebarTogglesSection");
    const setDrawerOpen = (open) => {
        if (!sidebar || !backdrop) return;
        sidebar.classList.toggle("is-open", open);
        backdrop.classList.toggle("is-open", open);
        if (menuBtn) {
            menuBtn.classList.toggle("is-open", open);
            menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
        }
        if (mobilePanelBtn) {
            mobilePanelBtn.classList.toggle("is-open", open);
            mobilePanelBtn.setAttribute("aria-expanded", open ? "true" : "false");
        }
        document.body.classList.toggle("is-drawer-open", open);
        // Disable scrolling on body when sidebar is open
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    };

    if (menuBtn) {
        menuBtn.addEventListener("click", () => {
            const isOpen = sidebar?.classList.contains("is-open");
            setDrawerOpen(!isOpen);
        });
    }

    if (mobilePanelBtn) {
        mobilePanelBtn.addEventListener("click", () => {
            const isOpen = sidebar?.classList.contains("is-open");
            const nextOpen = !isOpen;
            setDrawerOpen(nextOpen);

            if (nextOpen && sidebarToggleSection) {
                window.setTimeout(() => {
                    sidebarToggleSection.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 80);
            }
        });
    }

    if (backdrop) {
        backdrop.addEventListener("click", () => setDrawerOpen(false));
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") setDrawerOpen(false);
    });

    //prosentkalkulator
    const percentValueInput = document.getElementById("percentValue");
    const percentPercentInput = document.getElementById("percentPercent");
    const percentResultEl = document.getElementById("percentResult");
    const updatePercent = () => {
        if (!percentValueInput || !percentPercentInput || !percentResultEl) return;
        const valueStr = percentValueInput.value;
        const percentStr = percentPercentInput.value;
        if (!valueStr && !percentStr) {
            percentResultEl.textContent = "Resultat:";
            return;
        }
        const value = parseFloat(valueStr);
        const percent = parseFloat(percentStr);
        if (!isNaN(value) && !isNaN(percent)) {
            const result = (value * percent / 100).toFixed(2);
            percentResultEl.textContent = `Resultat: ${result}`;
        } else {
            percentResultEl.innerText = "Skriv inn gyldige tall.";
        }
    };
    if (percentValueInput) percentValueInput.addEventListener("input", updatePercent);
    if (percentPercentInput) percentPercentInput.addEventListener("input", updatePercent);
    updatePercent();

    //protein-kalkulator
    const proteinPriceInput = document.getElementById("proteinPrice");
    const proteinWeightInput = document.getElementById("proteinWeight");
    const proteinUnitInput = document.getElementById("proteinUnit");
    const proteinPer100Input = document.getElementById("proteinPer100");
    const proteinResultTotalEl = document.getElementById("proteinResultTotal");
    const proteinResultPricePerGramEl = document.getElementById("proteinResultPricePerGram");
    const proteinResultGramPerKroneEl = document.getElementById("proteinResultGramPerKrone");

    const updateProteinValue = () => {
        if (!proteinPriceInput || !proteinWeightInput || !proteinUnitInput || !proteinPer100Input) return;
        if (!proteinResultTotalEl || !proteinResultPricePerGramEl || !proteinResultGramPerKroneEl) return;

        const priceStr = proteinPriceInput.value;
        const weightStr = proteinWeightInput.value;
        const unit = proteinUnitInput.value;
        const proteinPer100Str = proteinPer100Input.value;

        if (!priceStr && !weightStr && !proteinPer100Str) {
            proteinResultTotalEl.innerText = "Total protein: -";
            proteinResultPricePerGramEl.innerText = "Kr per gram protein: -";
            proteinResultGramPerKroneEl.innerText = "Gram protein per krone: -";
            return;
        }

        const price = parseFloat(priceStr);
        const weight = parseFloat(weightStr);
        const proteinPer100 = parseFloat(proteinPer100Str);
        const unitToGramFactor = {
            g: 1,
            hg: 100,
            kg: 1000,
            l: 1000,
        };
        const gramFactor = unitToGramFactor[unit] || 1;

        if (
            Number.isNaN(price)
            || Number.isNaN(weight)
            || Number.isNaN(proteinPer100)
            || price <= 0
            || weight <= 0
            || proteinPer100 <= 0
        ) {
            proteinResultTotalEl.innerText = "Total protein: Skriv inn gyldige tall over 0.";
            proteinResultPricePerGramEl.innerText = "Kr per gram protein: -";
            proteinResultGramPerKroneEl.innerText = "Gram protein per krone: -";
            return;
        }

        const weightInGrams = weight * gramFactor;
        const totalProtein = (weightInGrams * proteinPer100) / 100;
        const krPerGramProtein = price / totalProtein;
        const gramsProteinPerKrone = totalProtein / price;

        proteinResultTotalEl.innerText = `Total protein: ${totalProtein.toFixed(1)} g`;
        proteinResultPricePerGramEl.innerText = `Kr per gram protein: ${krPerGramProtein.toFixed(2)} kr`;
        proteinResultGramPerKroneEl.innerText = `Gram protein per krone: ${gramsProteinPerKrone.toFixed(2)} g`;
    };

    if (proteinPriceInput) proteinPriceInput.addEventListener("input", updateProteinValue);
    if (proteinWeightInput) proteinWeightInput.addEventListener("input", updateProteinValue);
    if (proteinUnitInput) proteinUnitInput.addEventListener("change", updateProteinValue);
    if (proteinPer100Input) proteinPer100Input.addEventListener("input", updateProteinValue);
    updateProteinValue();

    //ki tekst-renser
    const textCleanerInput = document.getElementById("textCleanerInput");
    const textCleanerPasteInfo = document.getElementById("textCleanerPasteInfo");
    const textCleanerStrictToggle = document.getElementById("textCleanerStrictToggle");
    const textCleanerCopyBtn = document.getElementById("textCleanerCopyBtn");
    const textCleanerClearBtn = document.getElementById("textCleanerClearBtn");
    const textCleanerStatus = document.getElementById("textCleanerStatus");
    const textCleanerOutput = document.getElementById("textCleanerOutput");
    let rawCleanerText = "";

    const setCleanerSummary = (text, sourceLabel = "limt inn") => {
        const count = text.length;
        if (textCleanerPasteInfo) {
            textCleanerPasteInfo.innerText = count ? `${count} tegn ${sourceLabel}.` : "Ingen tekst limt inn ennå.";
        }
    };

    const htmlFallbackToText = (html) => {
        if (!html) return "";
        const withBreaks = html
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<li\b[^>]*>/gi, "- ")
            .replace(/<\/(p|div|h[1-6]|li|tr|section|article|blockquote)>/gi, "\n")
            .replace(/<[^>]+>/g, "");
        const decodeEl = document.createElement("textarea");
        decodeEl.innerHTML = withBreaks;
        return decodeEl.value;
    };

    const recoverPlainListBlocks = (text) => {
        const lines = text.split("\n");
        const recovered = [...lines];
        const isListLine = (line) => /^\s*(?:[-*+]|\d+[.)])\s+/.test(line);

        for (let i = 0; i < lines.length; i += 1) {
            const line = lines[i].trim();
            if (!line.endsWith(":")) continue;

            let start = i + 1;
            while (start < lines.length && !lines[start].trim()) start += 1;
            if (start >= lines.length) continue;

            let end = start;
            while (end < lines.length) {
                const current = lines[end].trim();
                if (!current) break;
                if (isListLine(current)) break;
                if (/^[#>]/.test(current)) break;
                end += 1;
            }

            const blockLength = end - start;
            if (blockLength >= 2) {
                for (let j = start; j < end; j += 1) {
                    recovered[j] = `- ${lines[j].trim()}`;
                }
                i = end - 1;
            }
        }

        return recovered.join("\n");
    };

    const normalizeCleanText = (text) => {
        if (!text) return "";

        const normalized = text
            .replace(/\r\n?/g, "\n")
            .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
            .replace(/[\u00A0\u2007\u202F]/g, " ")
            .replace(/[\u00AD\u034F\u061C\u180E\u200B-\u200F\u2060-\u2064\uFEFF]/g, "")
            .replace(/[“”„‟«»‹›〝〞＂]/g, '"')
            .replace(/[‘’‚‛❛❜＇]/g, "'")
            .replace(/[–—―−‐‑‒﹘﹣]/g, "-")
            .replace(/^[ \t]*[•◦●▪▫‣◉○◆▶►]\s+/gm, "- ")
            .replace(/^[ \t]*[*+]\s+/gm, "- ")
            .replace(/[ \t]+$/gm, "")
            .replace(/\n{3,}/g, "\n\n");

        return recoverPlainListBlocks(normalized).trim();
    };

    const applyStrictMode = (text) => {
        if (!text) return "";

        return text
            .replace(/é/g, "e")
            .replace(/[\p{M}]/gu, "")
            .replace(/[^A-Za-z0-9ÆØÅæøåé \n\t.,;:!?\'\"()\[\]{}\/\\@#%&*+=<>_-]/g, "")
            .replace(/[ \t]{2,}/g, " ")
            .replace(/\n{3,}/g, "\n\n")
            .trim();
    };

    const estimateTextCleanerChanges = (before, after) => {
        if (!before && !after) return 0;
        if (!before || !after) return Math.max(before.length, after.length);

        let i = 0;
        let j = 0;
        let changes = 0;
        const lookahead = 12;

        while (i < before.length && j < after.length) {
            if (before[i] === after[j]) {
                i += 1;
                j += 1;
                continue;
            }

            changes += 1;
            let aligned = false;

            for (let step = 1; step <= lookahead; step += 1) {
                if (i + step < before.length && before[i + step] === after[j]) {
                    i += step;
                    aligned = true;
                    break;
                }
                if (j + step < after.length && before[i] === after[j + step]) {
                    j += step;
                    aligned = true;
                    break;
                }
                if (
                    i + step < before.length
                    && j + step < after.length
                    && before[i + step] === after[j + step]
                ) {
                    i += step;
                    j += step;
                    aligned = true;
                    break;
                }
            }

            if (!aligned) {
                i += 1;
                j += 1;
            }
        }

        changes += (before.length - i) + (after.length - j);
        return changes;
    };

    const countTextCleanerChanges = (before, after) => {
        if (before === after) return 0;

        // Guard against quadratic work on very large input.
        const maxExactLength = 3500;
        if (before.length > maxExactLength || after.length > maxExactLength) {
            return estimateTextCleanerChanges(before, after);
        }

        const previous = new Array(after.length + 1);
        const current = new Array(after.length + 1);

        for (let j = 0; j <= after.length; j += 1) {
            previous[j] = j;
        }

        for (let i = 1; i <= before.length; i += 1) {
            current[0] = i;
            const beforeChar = before[i - 1];

            for (let j = 1; j <= after.length; j += 1) {
                const substitutionCost = beforeChar === after[j - 1] ? 0 : 1;
                const deletion = previous[j] + 1;
                const insertion = current[j - 1] + 1;
                const substitution = previous[j - 1] + substitutionCost;

                current[j] = Math.min(deletion, insertion, substitution);
            }

            for (let j = 0; j <= after.length; j += 1) {
                previous[j] = current[j];
            }
        }

        return previous[after.length];
    };

    const copyCleanerOutput = async () => {
        if (!textCleanerOutput || !textCleanerStatus) return;
        const value = textCleanerOutput.value;
        if (!value) {
            textCleanerStatus.innerText = "Ingen renset tekst å kopiere.";
            return;
        }
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(value);
            } else {
                textCleanerOutput.focus();
                textCleanerOutput.select();
                document.execCommand("copy");
            }
            textCleanerStatus.innerText = "Renset tekst kopiert.";
        } catch {
            textCleanerStatus.innerText = "Klarte ikke kopiere tekst.";
        }
    };

    const runTextCleaning = () => {
        if (!textCleanerOutput || !textCleanerStatus) return;
        if (!rawCleanerText.trim()) {
            textCleanerStatus.innerText = "Lim inn tekst først.";
            textCleanerOutput.value = "";
            return;
        }
        const strictMode = Boolean(textCleanerStrictToggle?.checked);
        const baseCleaned = normalizeCleanText(rawCleanerText);
        const cleaned = strictMode ? applyStrictMode(baseCleaned) : baseCleaned;
        const cleanedCount = countTextCleanerChanges(rawCleanerText, cleaned);
        const cleanedText = `${cleanedCount.toLocaleString("nb-NO")} tegn renset`;
        textCleanerOutput.value = cleaned;
        textCleanerStatus.innerText = cleaned
            ? `Tekst renset automatisk${strictMode ? " (streng modus)" : ""}. ${cleanedText}.`
            : `Ingen tekst igjen etter rensing. ${cleanedText}.`;
    };

    if (textCleanerInput) {
        textCleanerInput.addEventListener("paste", (event) => {
            event.preventDefault();
            const pastedPlain = event.clipboardData?.getData("text/plain") || "";
            const pastedHtml = event.clipboardData?.getData("text/html") || "";
            rawCleanerText = pastedPlain || htmlFallbackToText(pastedHtml);
            textCleanerInput.value = rawCleanerText;
            setCleanerSummary(rawCleanerText, "limt inn");
            runTextCleaning();
        });
        // Oppdater rawCleanerText og rens når brukeren skriver manuelt
        textCleanerInput.addEventListener("input", (event) => {
            rawCleanerText = textCleanerInput.value;
            setCleanerSummary(rawCleanerText, "skrevet");
            runTextCleaning();
        });
    }

    if (textCleanerCopyBtn) {
        textCleanerCopyBtn.addEventListener("click", copyCleanerOutput);
    }

    if (textCleanerStrictToggle) {
        textCleanerStrictToggle.addEventListener("change", runTextCleaning);
    }

    if (textCleanerClearBtn) {
        textCleanerClearBtn.addEventListener("click", () => {
            rawCleanerText = "";
            if (textCleanerInput) textCleanerInput.value = "";
            if (textCleanerOutput) textCleanerOutput.value = "";
            if (textCleanerStatus) textCleanerStatus.innerText = "";
            if (textCleanerPasteInfo) textCleanerPasteInfo.innerText = "Ingen tekst limt inn ennå.";
        });
    }

    //markdown converter
    const markdownConverterInput = document.getElementById("markdownConverterInput");
    const markdownConverterStatus = document.getElementById("markdownConverterStatus");
    const markdownConverterClearBtn = document.getElementById("markdownConverterClearBtn");
    const markdownConverterButtons = Array.from(document.querySelectorAll("[data-markdown-format]"));
    let markdownConverterStatusTimer = null;

    const setMarkdownConverterStatus = (message, isError = false) => {
        if (!markdownConverterStatus) return;
        markdownConverterStatus.innerText = message;
        markdownConverterStatus.classList.toggle("is-error", isError);
        if (markdownConverterStatusTimer) {
            clearTimeout(markdownConverterStatusTimer);
            markdownConverterStatusTimer = null;
        }
        if (!message) return;
        markdownConverterStatusTimer = setTimeout(() => {
            if (!markdownConverterStatus) return;
            markdownConverterStatus.innerText = "";
            markdownConverterStatus.classList.remove("is-error");
            markdownConverterStatusTimer = null;
        }, 2200);
    };

    const normalizeMarkdownLineBreaks = (text) => text.replace(/\r\n?/g, "\n");

    const formatMarkdownText = (format, inputText, options = {}) => {
        const { headingPerLine = false } = options;
        const normalizedText = normalizeMarkdownLineBreaks(inputText);
        switch (format) {
            case "heading":
                if (headingPerLine) {
                    return normalizedText
                        .split("\n")
                        .map((line) => `### ${line}`)
                        .join("\n");
                }
                return `### ${normalizedText}`;
            case "bold":
                return `**${normalizedText}**`;
            case "italic":
                return `_${normalizedText}_`;
            case "quote":
                return normalizedText
                    .split("\n")
                    .map((line) => `> ${line}`)
                    .join("\n");
            case "code":
                if (normalizedText.includes("\n")) {
                    return `\`\`\`\n${normalizedText}\n\`\`\``;
                }
                return `\`${normalizedText}\``;
            case "bullet":
                return normalizedText
                    .split("\n")
                    .map((line) => (line.trim() ? `- ${line}` : ""))
                    .join("\n");
            case "numbered": {
                let index = 0;
                return normalizedText
                    .split("\n")
                    .map((line) => {
                        if (!line.trim()) return "";
                        index += 1;
                        return `${index}. ${line}`;
                    })
                    .join("\n");
            }
            default:
                return normalizedText;
        }
    };

    const applyMarkdownFormatToSelection = (textarea, format) => {
        if (!textarea) return null;
        const selectionStart = textarea.selectionStart;
        const selectionEnd = textarea.selectionEnd;
        if (!Number.isInteger(selectionStart) || !Number.isInteger(selectionEnd)) return null;
        if (selectionEnd <= selectionStart) return null;

        const sourceText = textarea.value;
        const selectedText = sourceText.slice(selectionStart, selectionEnd);
        const formattedSelection = formatMarkdownText(format, selectedText, { headingPerLine: true });
        const nextText = `${sourceText.slice(0, selectionStart)}${formattedSelection}${sourceText.slice(selectionEnd)}`;

        return {
            value: nextText,
            selectionStart,
            selectionEnd: selectionStart + formattedSelection.length,
        };
    };

    const copyTextToClipboard = async (value) => {
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(value);
                return true;
            }
        } catch {
            // Fallback brukes under hvis Clipboard API feiler.
        }

        try {
            const fallback = document.createElement("textarea");
            fallback.value = value;
            fallback.setAttribute("readonly", "");
            fallback.style.position = "fixed";
            fallback.style.opacity = "0";
            fallback.style.pointerEvents = "none";
            document.body.appendChild(fallback);
            fallback.focus();
            fallback.select();
            const copied = document.execCommand("copy");
            document.body.removeChild(fallback);
            return copied;
        } catch {
            return false;
        }
    };

    if (markdownConverterInput && markdownConverterButtons.length) {
        const formatLabels = {
            heading: "Heading",
            bold: "Bold",
            italic: "Italic",
            quote: "Quote",
            code: "Code",
            bullet: "Bullet list",
            numbered: "Numbered list",
        };

        markdownConverterButtons.forEach((button) => {
            button.addEventListener("click", async () => {
                const format = button.dataset.markdownFormat;
                if (!format) return;

                const selectionUpdate = applyMarkdownFormatToSelection(markdownConverterInput, format);
                if (selectionUpdate) {
                    markdownConverterInput.value = selectionUpdate.value;
                    markdownConverterInput.focus();
                    markdownConverterInput.setSelectionRange(selectionUpdate.selectionStart, selectionUpdate.selectionEnd);

                    const copiedUpdatedText = await copyTextToClipboard(markdownConverterInput.value);
                    if (copiedUpdatedText) {
                        const label = formatLabels[format] || "Format";
                        setMarkdownConverterStatus(`Kopiert! ${label} klar i utklippstavlen.`);
                        return;
                    }

                    setMarkdownConverterStatus("Klarte ikke kopiere til utklippstavlen.", true);
                    return;
                }

                const inputText = markdownConverterInput.value;
                if (!inputText.trim()) {
                    setMarkdownConverterStatus("Skriv inn tekst først.", true);
                    return;
                }

                const convertedText = formatMarkdownText(format, inputText);
                const copied = await copyTextToClipboard(convertedText);

                if (copied) {
                    const label = formatLabels[format] || "Format";
                    setMarkdownConverterStatus(`Kopiert! ${label} klar i utklippstavlen.`);
                    return;
                }

                setMarkdownConverterStatus("Klarte ikke kopiere til utklippstavlen.", true);
            });
        });
    }

    if (markdownConverterClearBtn) {
        markdownConverterClearBtn.addEventListener("click", () => {
            if (markdownConverterStatusTimer) {
                clearTimeout(markdownConverterStatusTimer);
                markdownConverterStatusTimer = null;
            }
            if (markdownConverterInput) {
                markdownConverterInput.value = "";
                markdownConverterInput.focus();
            }
            if (markdownConverterStatus) {
                markdownConverterStatus.innerText = "";
                markdownConverterStatus.classList.remove("is-error");
            }
        });
    }

    //timeslønn
    const monthlySalaryInput = document.getElementById("monthlySalary");
    const hoursPerWeekInput = document.getElementById("hoursPerWeek");
    const hourlyResultEl = document.getElementById("hourlyResult");
    const updateHourly = () => {
        if (!monthlySalaryInput || !hoursPerWeekInput || !hourlyResultEl) return;
        const salaryStr = monthlySalaryInput.value;
        const hoursStr = hoursPerWeekInput.value;
        if (!salaryStr && !hoursStr) {
            hourlyResultEl.innerText = "Timeslønn:";
            return;
        }
        const salary = parseFloat(salaryStr);
        const hours = parseFloat(hoursStr);
        if (isNaN(salary) || isNaN(hours) || hours <= 0) {
            hourlyResultEl.innerText = "Skriv inn gyldige verdier.";
            return;
        }
        const yearlyHours = hours * 52;
        const hourly = (salary * 12 / yearlyHours).toFixed(2);
        hourlyResultEl.innerText = `Timeslønn: ${hourly} kr/t`;
    };
    if (monthlySalaryInput) monthlySalaryInput.addEventListener("input", updateHourly);
    if (hoursPerWeekInput) hoursPerWeekInput.addEventListener("input", updateHourly);
    updateHourly();

    //alderskalkulator
    const birthDateInput = document.getElementById("birthDate");
    const ageResultEl = document.getElementById("ageResult");
    const updateAge = () => {
        if (!birthDateInput || !ageResultEl) return;
        const birthStr = birthDateInput.value;
        if (!birthStr) {
            ageResultEl.innerText = "Omtrent ...";
            return;
        }
        const birth = new Date(birthStr);
        const now = new Date();
        const diffMs = now - birth;
        const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);
        const ageInYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
        const ageRounded = Math.floor(ageInYears * 10) / 10;
        const years = Math.floor(ageInYears);
        const months = Math.floor((ageInYears - years) * 12);
        if (years === 0 && months === 0) {
            const weeks = Math.floor(totalDays / 7);
            const days = totalDays % 7;
            ageResultEl.innerText = `Omtrent ${ageRounded} år (${weeks} uker og ${days} dager).`;
            return;
        }
        ageResultEl.innerText = `Omtrent ${ageRounded} år (${years} år og ${months} måneder, ca. ${totalWeeks} uker).`;
    };
    if (birthDateInput) birthDateInput.addEventListener("input", updateAge);
    updateAge();

    //dato-diff
    const date1Input = document.getElementById("date1");
    const date2Input = document.getElementById("date2");
    const dateDiffResultEl = document.getElementById("dateDiffResult");
    const updateDateDiff = () => {
        if (!date1Input || !date2Input || !dateDiffResultEl) return;
        const d1Str = date1Input.value;
        const d2Str = date2Input.value;
        if (!d1Str && !d2Str) {
            dateDiffResultEl.innerText = "";
            return;
        }
        if (!d1Str || !d2Str) {
            dateDiffResultEl.innerText = "Velg to gyldige datoer.";
            return;
        }
        const d1 = new Date(d1Str);
        const d2 = new Date(d2Str);
        if (isNaN(d1) || isNaN(d2)) {
            dateDiffResultEl.innerText = "Velg to gyldige datoer.";
            return;
        }
        const fromDate = d1 <= d2 ? d1 : d2;
        const toDate = d1 <= d2 ? d2 : d1;
        const diffMs = toDate - fromDate;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffWeeks = Math.floor(diffDays / 7);
        const remainingDays = diffDays % 7;
        let years = toDate.getFullYear() - fromDate.getFullYear();
        let months = toDate.getMonth() - fromDate.getMonth();
        if (months < 0) { years--; months += 12; }
        dateDiffResultEl.innerHTML = `Forskjell: ${diffDays} dager (${diffWeeks} uker og ${remainingDays} dager)<br>(${years} år og ${months} måneder)`;
    };
    if (date1Input) date1Input.addEventListener("input", updateDateDiff);
    if (date2Input) date2Input.addEventListener("input", updateDateDiff);
    updateDateDiff();

    //tid-diff
    const time1Input = document.getElementById("time1");
    const time2Input = document.getElementById("time2");
    const timeDiffResultEl = document.getElementById("timeDiffResult");

    //første input til nåværende tid
    if (time1Input) {
        const now = new Date();
        const pad = n => n.toString().padStart(2, '0');
        const currentTime = pad(now.getHours()) + ":" + pad(now.getMinutes());
        time1Input.value = currentTime;
    }
    if (time2Input) {
        time2Input.value = "";
    }

    const updateTimeDiff = () => {
        if (!time1Input || !time2Input || !timeDiffResultEl) return;
        const t1 = time1Input.value;
        const t2 = time2Input.value;
        if (!t1 && !t2) {
            timeDiffResultEl.innerText = "";
            return;
        }
        if (!t1 || !t2) {
            timeDiffResultEl.innerText = "Fyll inn begge klokkeslett.";
            return;
        }
        const [h1, m1] = t1.split(":").map(Number);
        const [h2, m2] = t2.split(":").map(Number);
        const total1 = h1 * 60 + m1;
        const total2 = h2 * 60 + m2;
        const diffMinutes = Math.abs(total2 - total1);
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;
        timeDiffResultEl.innerText = `Forskjell: ${hours} timer og ${minutes} minutter`;
    };
    if (time1Input) time1Input.addEventListener("input", updateTimeDiff);
    if (time2Input) time2Input.addEventListener("input", updateTimeDiff);
    updateTimeDiff();

    //tidssoner
    const tzBtn = document.getElementById("timezoneButton");
    if (tzBtn) {
        tzBtn.addEventListener("click", () => {
            const tzSelect = document.getElementById("timezoneSelect");
            const tzId = tzSelect.value;
            const tzLabel = tzSelect.options[tzSelect.selectedIndex].text;
            const el = document.getElementById("timezoneResult");
            try {
                const now = new Date().toLocaleString("nb-NO", { timeZone: tzId });
                if (el) el.innerText = `Tid i ${tzLabel}: ${now}`;
            } catch {
                if (el) el.innerText = `Ugyldig tidssone`;
            }
        });
    }

    //kalkulator
    const calcDisplay = document.getElementById("calcDisplay");
    const buttons = document.querySelectorAll(".calc-btn");
    let currentInput = "";

    const isMathOperator = (token) => token === "+" || token === "-" || token === "*" || token === "/";
    const isMathNumber = (token) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(token);

    const tokenizeMathExpression = (expression) => {
        const compact = String(expression || "").replace(/\s+/g, "");
        if (!compact) return [];

        const tokens = [];
        let numberBuffer = "";

        const flushNumber = () => {
            if (!numberBuffer) return;
            if (!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(numberBuffer)) {
                throw new Error("Ugyldig tall i uttrykket");
            }
            tokens.push(numberBuffer);
            numberBuffer = "";
        };

        for (const char of compact) {
            if (/\d|\./.test(char)) {
                numberBuffer += char;
                continue;
            }

            if (isMathOperator(char) || char === "(" || char === ")") {
                flushNumber();
                tokens.push(char);
                continue;
            }

            throw new Error("Ugyldige tegn i uttrykket");
        }

        flushNumber();

        const normalized = [];
        for (let i = 0; i < tokens.length; i += 1) {
            const token = tokens[i];
            const prevOriginal = i > 0 ? tokens[i - 1] : null;
            const unarySign = (token === "-" || token === "+")
                && (i === 0 || isMathOperator(prevOriginal) || prevOriginal === "(");

            if (unarySign) {
                const next = tokens[i + 1];
                if (next && /^(?:\d+(?:\.\d+)?|\.\d+)$/.test(next)) {
                    const signed = token === "-" ? -Number(next) : Number(next);
                    normalized.push(String(signed));
                    i += 1;
                    continue;
                }

                if (next === "(") {
                    if (token === "-") {
                        normalized.push("0");
                        normalized.push("-");
                    }
                    continue;
                }

                throw new Error("Ugyldig uttrykk");
            }

            normalized.push(token);
        }

        return normalized;
    };

    const evaluateMathExpression = (expression) => {
        const tokens = tokenizeMathExpression(expression);
        if (!tokens.length) return 0;

        const values = [];
        const operators = [];
        const precedence = { "+": 1, "-": 1, "*": 2, "/": 2 };

        const applyOperator = () => {
            const op = operators.pop();
            const right = values.pop();
            const left = values.pop();

            if (!isMathOperator(op) || !Number.isFinite(left) || !Number.isFinite(right)) {
                throw new Error("Ugyldig uttrykk");
            }

            let result = 0;
            if (op === "+") result = left + right;
            if (op === "-") result = left - right;
            if (op === "*") result = left * right;
            if (op === "/") {
                if (Math.abs(right) < Number.EPSILON) {
                    throw new Error("Kan ikke dele på 0");
                }
                result = left / right;
            }
            values.push(result);
        };

        tokens.forEach((token) => {
            if (isMathNumber(token)) {
                values.push(Number(token));
                return;
            }

            if (token === "(") {
                operators.push(token);
                return;
            }

            if (token === ")") {
                while (operators.length && operators[operators.length - 1] !== "(") {
                    applyOperator();
                }
                if (!operators.length || operators[operators.length - 1] !== "(") {
                    throw new Error("Mangler parentes");
                }
                operators.pop();
                return;
            }

            if (isMathOperator(token)) {
                while (
                    operators.length
                    && isMathOperator(operators[operators.length - 1])
                    && precedence[operators[operators.length - 1]] >= precedence[token]
                ) {
                    applyOperator();
                }
                operators.push(token);
                return;
            }

            throw new Error("Ugyldig uttrykk");
        });

        while (operators.length) {
            if (operators[operators.length - 1] === "(") {
                throw new Error("Mangler parentes");
            }
            applyOperator();
        }

        if (values.length !== 1 || !Number.isFinite(values[0])) {
            throw new Error("Ugyldig uttrykk");
        }

        return values[0];
    };

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            if (!calcDisplay) return;
            const value = (button.textContent || "").trim();

            if (button.id === "clear") {
                currentInput = "";
                calcDisplay.value = "";
                return;
            }

            if (button.id === "equals") {
                try {
                    const result = evaluateMathExpression(currentInput);
                    currentInput = Number.isInteger(result)
                        ? String(result)
                        : String(Number(result.toFixed(10)));
                    calcDisplay.value = currentInput;
                } catch {
                    calcDisplay.value = "Feil";
                    currentInput = "";
                }
                return;
            }

            if (!value) return;
            currentInput += value;
            calcDisplay.value = currentInput;
        });
    });

    //valutakalkulator
    const amountInput = document.getElementById("amount");
    const fromCurrencySelect = document.getElementById("fromCurrency");
    const currencySelect = document.getElementById("currency");
    const resEl = document.getElementById("result");
    const convertCurrency = async () => {
        if (!amountInput || !fromCurrencySelect || !currencySelect || !resEl) return;
        const amount = parseFloat(amountInput.value);
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = currencySelect.value;
        if (!amountInput.value || isNaN(amount) || amount <= 0) {
            resEl.innerText = "Skriv inn et gyldig beløp!";
            return;
        }
        if (fromCurrency === toCurrency) {
            resEl.innerText = `${amount} ${fromCurrency} = ${amount.toFixed(2)} ${toCurrency}`;
            return;
        }
        try {
            const res = await fetch(`https://api.frankfurter.app/latest?from=${fromCurrency}&to=${toCurrency}`);
            const data = await res.json();
            const rate = data.rates[toCurrency];
            if (!rate) {
                resEl.innerText = "Kunne ikke hente valutakurs";
                return;
            }
            const converted = (amount * rate).toFixed(2);
            resEl.innerText = `${amount} ${fromCurrency} = ${converted} ${toCurrency}`;
        } catch (error) {
            console.error("❌ API-feil:", error);
            resEl.innerText = "Kunne ikke hente valutakurs";
        }
    };
    if (amountInput) amountInput.addEventListener("input", convertCurrency);
    if (fromCurrencySelect) fromCurrencySelect.addEventListener("change", convertCurrency);
    if (currencySelect) currencySelect.addEventListener("change", convertCurrency);

    //unit converter
    const unitConverterValueInput = document.getElementById("unitConverterValue");
    const unitConverterCategorySelect = document.getElementById("unitConverterCategory");
    const unitConverterFromSelect = document.getElementById("unitConverterFrom");
    const unitConverterToSelect = document.getElementById("unitConverterTo");
    const unitConverterSwapBtn = document.getElementById("unitConverterSwap");
    const unitConverterResultEl = document.getElementById("unitConverterResult");

    const createLinearUnit = (value, label, symbol, factor) => ({
        value,
        label,
        symbol,
        toBase: (input) => input * factor,
        fromBase: (input) => input / factor,
    });

    const unitConverterCategories = {
        length: {
            label: "Lengde",
            defaultFrom: "m",
            defaultTo: "km",
            units: [
                createLinearUnit("mm", "Millimeter (mm)", "mm", 0.001),
                createLinearUnit("cm", "Centimeter (cm)", "cm", 0.01),
                createLinearUnit("m", "Meter (m)", "m", 1),
                createLinearUnit("km", "Kilometer (km)", "km", 1000),
                createLinearUnit("in", "Inches (in)", "in", 0.0254),
                createLinearUnit("ft", "Feet (ft)", "ft", 0.3048),
                createLinearUnit("yd", "Yards (yd)", "yd", 0.9144),
                createLinearUnit("mi", "Miles (mi)", "mi", 1609.344),
            ],
        },
        weight: {
            label: "Vekt",
            defaultFrom: "g",
            defaultTo: "kg",
            units: [
                createLinearUnit("mg", "Milligram (mg)", "mg", 0.001),
                createLinearUnit("g", "Gram (g)", "g", 1),
                createLinearUnit("kg", "Kilogram (kg)", "kg", 1000),
                createLinearUnit("oz", "Ounces (oz)", "oz", 28.349523125),
                createLinearUnit("lb", "Pounds (lb)", "lb", 453.59237),
                createLinearUnit("st", "Stones (st)", "st", 6350.29318),
            ],
        },
        temperature: {
            label: "Temperatur",
            defaultFrom: "c",
            defaultTo: "f",
            units: [
                {
                    value: "c",
                    label: "Celsius (°C)",
                    symbol: "°C",
                    toBase: (input) => input,
                    fromBase: (input) => input,
                },
                {
                    value: "f",
                    label: "Fahrenheit (°F)",
                    symbol: "°F",
                    toBase: (input) => ((input - 32) * 5) / 9,
                    fromBase: (input) => (input * 9) / 5 + 32,
                },
                {
                    value: "k",
                    label: "Kelvin (K)",
                    symbol: "K",
                    toBase: (input) => input - 273.15,
                    fromBase: (input) => input + 273.15,
                },
            ],
        },
        area: {
            label: "Areal",
            defaultFrom: "m2",
            defaultTo: "km2",
            units: [
                createLinearUnit("mm2", "mm²", "mm²", 0.000001),
                createLinearUnit("cm2", "cm²", "cm²", 0.0001),
                createLinearUnit("m2", "m²", "m²", 1),
                createLinearUnit("km2", "km²", "km²", 1000000),
                createLinearUnit("ft2", "ft²", "ft²", 0.09290304),
                createLinearUnit("in2", "in²", "in²", 0.00064516),
                createLinearUnit("ac", "Acres", "acres", 4046.8564224),
                createLinearUnit("ha", "Hektar (ha)", "ha", 10000),
            ],
        },
        volume: {
            label: "Volum",
            defaultFrom: "l",
            defaultTo: "ml",
            units: [
                createLinearUnit("ml", "Milliliter (ml)", "ml", 0.001),
                createLinearUnit("l", "Liter (L)", "L", 1),
                createLinearUnit("m3", "Kubikkmeter (m³)", "m³", 1000),
                createLinearUnit("tsp", "Teaspoon (tsp)", "tsp", 0.00492892159375),
                createLinearUnit("tbsp", "Tablespoon (tbsp)", "tbsp", 0.01478676478125),
                createLinearUnit("cup", "Cups", "cups", 0.2365882365),
                createLinearUnit("pt", "Pints", "pints", 0.473176473),
                createLinearUnit("gal", "Gallons (US)", "gal", 3.785411784),
            ],
        },
        speed: {
            label: "Hastighet",
            defaultFrom: "kmh",
            defaultTo: "mph",
            units: [
                createLinearUnit("kmh", "km/t", "km/t", 1000 / 3600),
                createLinearUnit("mph", "mph", "mph", 0.44704),
                createLinearUnit("ms", "m/s", "m/s", 1),
                createLinearUnit("kn", "Knop (kn)", "kn", 0.514444444444),
            ],
        },
        time: {
            label: "Tid",
            defaultFrom: "min",
            defaultTo: "h",
            units: [
                createLinearUnit("s", "Sekunder", "sek", 1),
                createLinearUnit("min", "Minutter", "min", 60),
                createLinearUnit("h", "Timer", "timer", 3600),
                createLinearUnit("d", "Dager", "dager", 86400),
                createLinearUnit("w", "Uker", "uker", 604800),
            ],
        },
        data: {
            label: "Datastørrelse",
            defaultFrom: "mb",
            defaultTo: "gb",
            units: [
                createLinearUnit("b", "Byte", "B", 1),
                createLinearUnit("kb", "KB", "KB", 1024),
                createLinearUnit("mb", "MB", "MB", 1024 ** 2),
                createLinearUnit("gb", "GB", "GB", 1024 ** 3),
                createLinearUnit("tb", "TB", "TB", 1024 ** 4),
            ],
        },
    };

    const getUnitConverterCategory = (categoryKey) => unitConverterCategories[categoryKey] || null;

    const formatUnitConverterNumber = (value) => {
        if (!Number.isFinite(value)) return "";

        const normalized = Math.abs(value) < 1e-12 ? 0 : value;
        const abs = Math.abs(normalized);

        if (abs !== 0 && (abs >= 1e12 || abs < 1e-6)) {
            const [mantissa, exponent] = normalized.toExponential(6).split("e");
            const formattedMantissa = Number(mantissa).toLocaleString("nb-NO", {
                maximumFractionDigits: 6,
            });
            const parsedExponent = Number(exponent);
            return `${formattedMantissa}e${parsedExponent >= 0 ? "+" : ""}${parsedExponent}`;
        }

        const maxFractionDigits = abs >= 1000 ? 2 : abs >= 1 ? 4 : 8;
        return normalized.toLocaleString("nb-NO", {
            maximumFractionDigits: maxFractionDigits,
        });
    };

    const parseUnitConverterValue = (rawValue) => {
        if (typeof rawValue !== "string") return Number.NaN;
        const normalized = rawValue.trim().replace(",", ".");
        if (!normalized) return Number.NaN;
        return Number.parseFloat(normalized);
    };

    const renderUnitConverterCategoryOptions = () => {
        if (!unitConverterCategorySelect) return;
        unitConverterCategorySelect.innerHTML = "";

        Object.entries(unitConverterCategories).forEach(([categoryKey, category]) => {
            const option = document.createElement("option");
            option.value = categoryKey;
            option.textContent = category.label;
            unitConverterCategorySelect.appendChild(option);
        });
    };

    const renderUnitConverterUnitOptions = (categoryKey, preferredFrom, preferredTo) => {
        if (!unitConverterFromSelect || !unitConverterToSelect) return;
        const category = getUnitConverterCategory(categoryKey);
        if (!category) return;

        const units = Array.isArray(category.units) ? category.units : [];
        unitConverterFromSelect.innerHTML = "";
        unitConverterToSelect.innerHTML = "";

        units.forEach((unit) => {
            const fromOption = document.createElement("option");
            fromOption.value = unit.value;
            fromOption.textContent = unit.label;
            unitConverterFromSelect.appendChild(fromOption);

            const toOption = document.createElement("option");
            toOption.value = unit.value;
            toOption.textContent = unit.label;
            unitConverterToSelect.appendChild(toOption);
        });

        if (!units.length) return;

        const availableValues = new Set(units.map((unit) => unit.value));
        const fallbackFrom = availableValues.has(category.defaultFrom)
            ? category.defaultFrom
            : units[0].value;
        const fallbackTo = availableValues.has(category.defaultTo)
            ? category.defaultTo
            : units[Math.min(1, units.length - 1)].value;

        const nextFrom = availableValues.has(preferredFrom) ? preferredFrom : fallbackFrom;
        let nextTo = availableValues.has(preferredTo) ? preferredTo : fallbackTo;

        if (nextFrom === nextTo && units.length > 1) {
            const alternate = units.find((unit) => unit.value !== nextFrom);
            if (alternate) nextTo = alternate.value;
        }

        unitConverterFromSelect.value = nextFrom;
        unitConverterToSelect.value = nextTo;
    };

    const updateUnitConverter = () => {
        if (!unitConverterValueInput || !unitConverterCategorySelect || !unitConverterFromSelect) return;
        if (!unitConverterToSelect || !unitConverterResultEl) return;

        const rawValue = unitConverterValueInput.value;
        if (!rawValue.trim()) {
            unitConverterResultEl.innerText = "Resultat: -";
            return;
        }

        const numericValue = parseUnitConverterValue(rawValue);
        if (!Number.isFinite(numericValue)) {
            unitConverterResultEl.innerText = "Skriv inn et gyldig tall.";
            return;
        }

        const category = getUnitConverterCategory(unitConverterCategorySelect.value);
        if (!category || !Array.isArray(category.units)) {
            unitConverterResultEl.innerText = "Velg en gyldig kategori.";
            return;
        }

        const unitMap = new Map(category.units.map((unit) => [unit.value, unit]));
        const fromUnit = unitMap.get(unitConverterFromSelect.value);
        const toUnit = unitMap.get(unitConverterToSelect.value);

        if (!fromUnit || !toUnit) {
            unitConverterResultEl.innerText = "Velg gyldige enheter.";
            return;
        }

        try {
            const baseValue = fromUnit.toBase(numericValue);
            const convertedValue = toUnit.fromBase(baseValue);

            if (!Number.isFinite(convertedValue)) {
                unitConverterResultEl.innerText = "Kunne ikke konvertere verdien.";
                return;
            }

            const fromFormatted = formatUnitConverterNumber(numericValue);
            const toFormatted = formatUnitConverterNumber(convertedValue);
            unitConverterResultEl.innerText = `Resultat: ${fromFormatted} ${fromUnit.symbol} = ${toFormatted} ${toUnit.symbol}`;
        } catch {
            unitConverterResultEl.innerText = "Kunne ikke konvertere verdien.";
        }
    };

    if (
        unitConverterValueInput
        && unitConverterCategorySelect
        && unitConverterFromSelect
        && unitConverterToSelect
        && unitConverterSwapBtn
        && unitConverterResultEl
    ) {
        renderUnitConverterCategoryOptions();

        const defaultCategory = unitConverterCategorySelect.value || Object.keys(unitConverterCategories)[0];
        unitConverterCategorySelect.value = defaultCategory;
        renderUnitConverterUnitOptions(defaultCategory);

        unitConverterCategorySelect.addEventListener("change", () => {
            renderUnitConverterUnitOptions(
                unitConverterCategorySelect.value,
                unitConverterFromSelect.value,
                unitConverterToSelect.value
            );
            updateUnitConverter();
        });

        unitConverterFromSelect.addEventListener("change", updateUnitConverter);
        unitConverterToSelect.addEventListener("change", updateUnitConverter);
        unitConverterValueInput.addEventListener("input", updateUnitConverter);

        const setUnitConverterSwapIcon = (iconName) => {
            unitConverterSwapBtn.dataset.swapIcon = iconName;
            unitConverterSwapBtn.innerHTML = `<i data-lucide="${iconName}" class="unit-converter-swap__icon" aria-hidden="true"></i>`;
            if (window.lucide && typeof window.lucide.createIcons === "function") {
                window.lucide.createIcons();
            }
        };

        unitConverterSwapBtn.dataset.swapIcon = "arrow-left-right";

        unitConverterSwapBtn.addEventListener("click", () => {
            const currentFrom = unitConverterFromSelect.value;
            unitConverterFromSelect.value = unitConverterToSelect.value;
            unitConverterToSelect.value = currentFrom;

            const currentIcon = unitConverterSwapBtn.dataset.swapIcon || "arrow-left-right";
            const nextIcon = currentIcon === "arrow-left-right"
                ? "arrow-right-left"
                : "arrow-left-right";
            setUnitConverterSwapIcon(nextIcon);

            updateUnitConverter();
        });

        updateUnitConverter();
    }

    //entur ruter
    const enturBtn = document.getElementById("enturSearchBtn");
    const enturFromInput = document.getElementById("enturFrom");
    const enturToInput = document.getElementById("enturTo");
    const enturFromResults = document.getElementById("enturFromResults");
    const enturToResults = document.getElementById("enturToResults");
    const enturDateInput = document.getElementById("enturDate");
    const enturTimeInput = document.getElementById("enturTime");
    const enturStatusEl = document.getElementById("enturStatus");
    const enturMapEl = document.getElementById("enturMap");
    const enturResultsEl = document.getElementById("enturResults");
    const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
    const ENTUR_REMOTE_FUNCTION_BASE = "https://altkalkis.lbraten.xyz";
    const ENTUR_CLIENT_NAME = "alt-i-ett-kalkulator";
    const ENTUR_GEOCODER_API = "https://api.entur.io/geocoder/v1/autocomplete";
    const ENTUR_JOURNEY_API = "https://api.entur.io/journey-planner/v3/graphql";
    let enturMap = null;
    let enturMapLayer = null;
    let enturCurrentTrips = [];
    let enturSelectedFromPlace = null;
    let enturSelectedToPlace = null;

    const setEnturDefaults = () => {
        if (!enturDateInput || !enturTimeInput) return;
        const now = new Date();
        if (!enturDateInput.value) enturDateInput.value = now.toISOString().slice(0, 10);
        if (!enturTimeInput.value) enturTimeInput.value = now.toTimeString().slice(0, 5);
    };

    const formatEnturTime = (iso) => {
        if (!iso) return "";
        const date = new Date(iso);
        return date.toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" });
    };

    const formatEnturDuration = (seconds) => {
        if (typeof seconds !== "number") return "";
        const mins = Math.round(seconds / 60);
        const hours = Math.floor(mins / 60);
        const rest = mins % 60;
        return hours > 0 ? `${hours} t ${rest} min` : `${rest} min`;
    };

    const fetchEnturPlaceSuggestions = async (queryText, size = 8) => {
        const query = (queryText || "").trim();
        if (query.length < 2) return [];

        const url = new URL(ENTUR_GEOCODER_API);
        url.searchParams.set("text", query);
        url.searchParams.set("size", String(size));
        url.searchParams.set("lang", "no");

        const res = await fetch(url.toString(), {
            headers: {
                Accept: "application/json",
                "ET-Client-Name": ENTUR_CLIENT_NAME,
            },
        });

        if (!res.ok) {
            throw new Error(`Kunne ikke slå opp sted: ${query}`);
        }

        const payload = await res.json();
        const features = Array.isArray(payload?.features) ? payload.features : [];

        return features
            .map((feature) => {
                const props = feature?.properties || {};
                const id = props.id || feature?.id;
                const label = props.label || props.name || "Ukjent sted";
                if (typeof id !== "string") return null;
                return {
                    id,
                    label,
                    name: props.name || label,
                    locality: props.locality || "",
                    county: props.county || "",
                    country: props.country || "",
                };
            })
            .filter((entry) => entry && entry.id.includes("StopPlace"));
    };

    const formatEnturSuggestionMeta = (entry) => [entry.locality, entry.county, entry.country].filter(Boolean).join(", ");

    const setupEnturAutocomplete = ({
        inputEl,
        resultsEl,
        setSelected,
        getOtherOpenResults,
    }) => {
        if (!inputEl || !resultsEl) return;
        const container = inputEl.closest(".route-input-group");
        let resultsData = [];
        let activeIndex = -1;
        let searchTimer = null;

        const close = () => {
            resultsEl.hidden = true;
            inputEl.setAttribute("aria-expanded", "false");
            activeIndex = -1;
        };

        const setActiveResult = (nextIndex) => {
            const nodes = Array.from(resultsEl.querySelectorAll(".weather-location-results__item"));
            nodes.forEach((node, idx) => {
                const isActive = idx === nextIndex;
                node.classList.toggle("is-active", isActive);
                node.setAttribute("aria-selected", isActive ? "true" : "false");
            });
            activeIndex = nextIndex;
        };

        const selectResult = (entry) => {
            if (!entry?.id) return;
            inputEl.value = entry.label;
            setSelected(entry);
            close();
        };

        const render = (results = []) => {
            resultsEl.innerHTML = "";
            resultsData = results;

            if (!results.length) {
                close();
                return;
            }

            results.forEach((entry, index) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "weather-location-results__item";
                button.setAttribute("role", "option");
                button.setAttribute("aria-selected", "false");

                const name = document.createElement("span");
                name.className = "weather-location-results__name";
                name.textContent = entry.label;

                const meta = document.createElement("span");
                meta.className = "weather-location-results__meta";
                meta.textContent = formatEnturSuggestionMeta(entry);

                button.append(name, meta);
                button.addEventListener("click", () => selectResult(entry));
                button.addEventListener("mouseenter", () => setActiveResult(index));
                resultsEl.appendChild(button);
            });

            const otherResults = getOtherOpenResults?.();
            if (otherResults) {
                otherResults.hidden = true;
                const otherInput = otherResults.id === "enturFromResults" ? enturFromInput : enturToInput;
                otherInput?.setAttribute("aria-expanded", "false");
            }

            resultsEl.hidden = false;
            inputEl.setAttribute("aria-expanded", "true");
            setActiveResult(-1);
        };

        const fetchAndRender = async (queryText) => {
            try {
                const suggestions = await fetchEnturPlaceSuggestions(queryText, 8);
                render(suggestions);
            } catch (error) {
                console.error(error);
                close();
            }
        };

        inputEl.addEventListener("input", () => {
            setSelected(null);
            if (searchTimer) clearTimeout(searchTimer);
            searchTimer = setTimeout(() => {
                fetchAndRender(inputEl.value);
            }, 220);
        });

        inputEl.addEventListener("focus", () => {
            if (resultsData.length) {
                resultsEl.hidden = false;
                inputEl.setAttribute("aria-expanded", "true");
            }
        });

        inputEl.addEventListener("keydown", (event) => {
            if (resultsEl.hidden || !resultsData.length) return;
            if (event.key === "ArrowDown") {
                event.preventDefault();
                const next = Math.min(activeIndex + 1, resultsData.length - 1);
                setActiveResult(next);
                return;
            }
            if (event.key === "ArrowUp") {
                event.preventDefault();
                const next = Math.max(activeIndex - 1, 0);
                setActiveResult(next);
                return;
            }
            if (event.key === "Enter" && activeIndex >= 0) {
                event.preventDefault();
                selectResult(resultsData[activeIndex]);
                return;
            }
            if (event.key === "Escape") {
                close();
            }
        });

        document.addEventListener("click", (event) => {
            if (!container) return;
            if (!container.contains(event.target)) close();
        });
    };

    const renderEnturResults = (trips = []) => {
        if (!enturResultsEl) return;
        enturCurrentTrips = trips;
        enturResultsEl.innerHTML = "";

        if (!trips.length) {
            enturResultsEl.innerHTML = "<p>Ingen ruter funnet.</p>";
            renderEnturTripOnMap(null);
            return;
        }

        trips.forEach((trip, index) => {
            const card = document.createElement("div");
            card.className = "route-card";
            if (index === 0) card.classList.add("route-card--selected");
            card.tabIndex = 0;
            card.setAttribute("role", "button");
            card.setAttribute("aria-label", `Vis rute ${index + 1} i kart`);

            const meta = document.createElement("div");
            meta.className = "route-card__meta";
            meta.textContent = `Varighet: ${formatEnturDuration(trip.duration)} · ${formatEnturTime(trip.departure)}–${formatEnturTime(trip.arrival)}`;

            const legs = document.createElement("div");
            legs.className = "route-legs";

            (trip.legs || []).forEach((leg) => {
                const legEl = document.createElement("div");
                legEl.className = "route-leg";

                const mode = document.createElement("span");
                mode.className = "route-leg__mode";
                mode.textContent = leg.modeLabel || leg.mode || "Ukjent";

                const info = document.createElement("span");
                const line = leg.line ? ` (${leg.line})` : "";
                info.textContent = `${leg.from} → ${leg.to}${line}`;

                legEl.append(mode, info);
                legs.appendChild(legEl);
            });

            card.addEventListener("click", () => selectEnturTrip(index));
            card.addEventListener("keydown", (event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                selectEnturTrip(index);
            });

            card.append(meta, legs);
            enturResultsEl.appendChild(card);
        });

        renderEnturTripOnMap(trips[0]);
    };

    const initEnturMap = () => {
        if (!enturMapEl || !window.L || enturMap) return;
        enturMap = window.L.map(enturMapEl, {
            zoomControl: true,
            scrollWheelZoom: false,
        });
        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 18,
            attribution: "&copy; OpenStreetMap",
        }).addTo(enturMap);
        enturMap.setView([59.9139, 10.7522], 6);
    };

    const selectEnturTrip = (index) => {
        const cards = enturResultsEl ? enturResultsEl.querySelectorAll(".route-card") : [];
        cards.forEach((card, cardIndex) => {
            card.classList.toggle("route-card--selected", cardIndex === index);
        });
        renderEnturTripOnMap(enturCurrentTrips[index] || null);
    };

    const getTripCoordinates = (trip) => {
        if (!trip?.legs?.length) return [];
        const points = [];

        trip.legs.forEach((leg) => {
            if (typeof leg.fromLat === "number" && typeof leg.fromLon === "number") {
                points.push([leg.fromLat, leg.fromLon]);
            }
        });

        const lastLeg = trip.legs[trip.legs.length - 1];
        if (typeof lastLeg?.toLat === "number" && typeof lastLeg?.toLon === "number") {
            points.push([lastLeg.toLat, lastLeg.toLon]);
        }

        return points;
    };

    const renderEnturTripOnMap = (trip) => {
        initEnturMap();
        if (!enturMap) return;

        if (enturMapLayer) {
            enturMap.removeLayer(enturMapLayer);
            enturMapLayer = null;
        }

        if (!trip) {
            enturMap.setView([59.9139, 10.7522], 6);
            return;
        }

        const coords = getTripCoordinates(trip);
        if (coords.length < 2) {
            enturMap.setView([59.9139, 10.7522], 6);
            return;
        }

        const line = window.L.polyline(coords, {
            color: "rgb(var(--color-ring))",
            weight: 4,
            opacity: 0.9,
        });
        const markers = coords.map((coord, index) => window.L.circleMarker(coord, {
            radius: index === 0 || index === coords.length - 1 ? 6 : 4,
            color: "rgba(var(--color-text-base), 0.9)",
            weight: 2,
            fillColor: "rgb(var(--color-button-accent))",
            fillOpacity: 0.9,
        }));

        enturMapLayer = window.L.featureGroup([line, ...markers]).addTo(enturMap);
        enturMap.fitBounds(enturMapLayer.getBounds(), { padding: [20, 20] });
    };

    const toIsoLocalDateTime = (date, time) => {
        const parsed = new Date(`${date}T${time}:00`);
        if (Number.isNaN(parsed.getTime())) return `${date}T${time}:00`;
        const offsetMinutes = -parsed.getTimezoneOffset();
        const sign = offsetMinutes >= 0 ? "+" : "-";
        const absolute = Math.abs(offsetMinutes);
        const hours = String(Math.floor(absolute / 60)).padStart(2, "0");
        const minutes = String(absolute % 60).padStart(2, "0");
        return `${date}T${time}:00${sign}${hours}:${minutes}`;
    };

    const resolveEnturPlace = async (query) => {
        const suggestions = await fetchEnturPlaceSuggestions(query, 5);
        const best = suggestions[0];
        if (!best?.id) throw new Error(`Fant ikke stoppested for: ${query}`);
        return { id: best.id, name: best.label || best.name || query };
    };

    const fetchEnturRoutesDirect = async ({ from, to, date, time, fromPlace, toPlace }) => {
        const [resolvedFromPlace, resolvedToPlace] = await Promise.all([
            fromPlace?.id ? Promise.resolve(fromPlace) : resolveEnturPlace(from),
            toPlace?.id ? Promise.resolve(toPlace) : resolveEnturPlace(to),
        ]);

        const query = `
            query Trip($from: Location!, $to: Location!, $dateTime: DateTime!, $num: Int!) {
              trip(from: $from, to: $to, dateTime: $dateTime, numTripPatterns: $num) {
                tripPatterns {
                  duration
                  startTime
                  endTime
                  legs {
                    mode
                                        fromPlace { name latitude longitude }
                                        toPlace { name latitude longitude }
                    line { publicCode }
                  }
                }
              }
            }
        `;

        const variables = {
            from: { place: resolvedFromPlace.id },
            to: { place: resolvedToPlace.id },
            dateTime: toIsoLocalDateTime(date, time),
            num: 5,
        };

        const res = await fetch(ENTUR_JOURNEY_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "ET-Client-Name": ENTUR_CLIENT_NAME,
            },
            body: JSON.stringify({ query, variables }),
        });

        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
            throw new Error("Uventet svar fra Entur API.");
        }

        const payload = await res.json();
        if (!res.ok || payload?.errors?.length) {
            throw new Error(payload?.errors?.[0]?.message || "Entur API-feil.");
        }

        const tripPatterns = payload?.data?.trip?.tripPatterns || [];
        const trips = tripPatterns.map((pattern) => ({
            duration: pattern?.duration,
            departure: pattern?.startTime,
            arrival: pattern?.endTime,
            legs: (pattern?.legs || []).map((leg) => ({
                mode: leg?.mode,
                modeLabel: leg?.mode,
                from: leg?.fromPlace?.name || "Ukjent",
                to: leg?.toPlace?.name || "Ukjent",
                line: leg?.line?.publicCode || "",
                fromLat: leg?.fromPlace?.latitude,
                fromLon: leg?.fromPlace?.longitude,
                toLat: leg?.toPlace?.latitude,
                toLon: leg?.toPlace?.longitude,
            })),
        }));

        return {
            message: trips.length
                ? `Viser ${trips.length} forslag.`
                : "Ingen ruter funnet.",
            trips,
        };
    };

    const fetchEnturRoutes = async () => {
        if (!enturFromInput || !enturToInput || !enturDateInput || !enturTimeInput || !enturStatusEl) return;
        const from = enturFromInput.value.trim();
        const to = enturToInput.value.trim();
        const date = enturDateInput.value;
        const time = enturTimeInput.value;

        if (!from || !to) {
            enturStatusEl.textContent = "Skriv inn både Fra og Til.";
            renderEnturResults([]);
            return;
        }

        enturStatusEl.textContent = "Henter ruter…";
        renderEnturResults([]);

        try {
            const params = new URLSearchParams({ from, to, date, time });
            const candidateEndpoints = ["/.netlify/functions/entur-routes"];
            if (isLocalHost) {
                candidateEndpoints.push(`${ENTUR_REMOTE_FUNCTION_BASE}/.netlify/functions/entur-routes`);
            }

            let data = null;
            let lastError = null;

            for (const endpoint of candidateEndpoints) {
                const res = await fetch(`${endpoint}?${params.toString()}`, {
                    headers: { Accept: "application/json" },
                });
                const contentType = res.headers.get("content-type") || "";

                if (!contentType.includes("application/json")) {
                    const text = await res.text();
                    lastError = new Error(`Uventet svar fra Entur-tjenesten (${res.status}).`);
                    const htmlGetError = text.includes("Cannot GET") || text.includes("<!DOCTYPE html>");
                    if (isLocalHost && htmlGetError) continue;
                    throw lastError;
                }

                data = await res.json();
                if (!res.ok) {
                    lastError = new Error(data?.error || `HTTP ${res.status}`);
                    continue;
                }

                lastError = null;
                break;
            }

            if (lastError) {
                data = await fetchEnturRoutesDirect({
                    from,
                    to,
                    date,
                    time,
                    fromPlace: enturSelectedFromPlace,
                    toPlace: enturSelectedToPlace,
                });
            }

            enturStatusEl.textContent = data?.message || "";
            renderEnturResults(data?.trips || []);
        } catch (err) {
            console.error("Entur-feil:", err);
            enturStatusEl.textContent = err?.message || "Kunne ikke hente ruter.";
        }
    };

    setupEnturAutocomplete({
        inputEl: enturFromInput,
        resultsEl: enturFromResults,
        setSelected: (value) => { enturSelectedFromPlace = value; },
        getOtherOpenResults: () => enturToResults,
    });

    setupEnturAutocomplete({
        inputEl: enturToInput,
        resultsEl: enturToResults,
        setSelected: (value) => { enturSelectedToPlace = value; },
        getOtherOpenResults: () => enturFromResults,
    });

    if (enturBtn) enturBtn.addEventListener("click", fetchEnturRoutes);
    [enturFromInput, enturToInput, enturDateInput, enturTimeInput].forEach((input) => {
        if (!input) return;
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") fetchEnturRoutes();
        });
    });
    setEnturDefaults();


    //sitat fra lokal JSON-liste (random per dag)
    async function getDailyQuote() {
    const el = document.getElementById("quoteResult");

    try {
        const res = await fetch("data/quote.json", {
            headers: { "Accept": "application/json" },
        });

        if (!res.ok) throw new Error(`Quote-fil-feil: ${res.status}`);

        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        if (!list.length) {
            el.innerText = "Ingen sitat tilgjengelig.";
            return;
        }

        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const dayOfYear = Math.floor((now - start) / 86400000);
        const q = list[dayOfYear % list.length];

        const quote = q?.text || q?.quote || q?.content;
        const author = q?.author || "Ukjent";
        const cleanQuote = typeof quote === "string"
            ? quote.trim().replace(/^[\"“”]+|[\"“”]+$/g, "")
            : "";

        if (cleanQuote && author) {
        el.innerText = `"${cleanQuote}" - ${author}`;
        } else {
        el.innerText = "Ingen sitat tilgjengelig.";
        }
    } catch (err) {
        console.error(err);
        el.innerText = "Klarte ikke hente sitat";
    }
    }

    getDailyQuote();

    //nrk nyheter (rss)
    const nrkStatusEl = document.getElementById("nrkNewsStatus");
    const nrkListEl = document.getElementById("nrkNewsList");

    const stripHtml = (value) => {
        if (!value) return "";
        return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    };

    const formatNrkTime = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        if (Number.isNaN(date.getTime())) return "";
        return date.toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" });
    };

    const renderNrkNews = (items) => {
        if (!nrkListEl) return;
        nrkListEl.innerHTML = "";

        items.forEach((item) => {
            const link = item.link || "https://www.nrk.no/nyheter/";
            const card = document.createElement("a");
            card.className = "nrk-news-item";
            card.href = link;
            card.target = "_blank";
            card.rel = "noopener";

            const time = document.createElement("div");
            time.className = "nrk-news-time";
            time.textContent = item.time || "";

            const category = document.createElement("div");
            category.className = "nrk-news-category";
            category.textContent = item.category || "NRK Nyheter";

            const title = document.createElement("div");
            title.className = "nrk-news-title";
            title.textContent = item.title || "";

            card.append(time, category, title);
            nrkListEl.appendChild(card);
        });
    };

    const NRK_CACHE_KEY = "nrkNewsCache";
    const NRK_CACHE_TTL = 1000 * 60 * 15; //15 min
    const NRK_STALE_WARNING_MS = 1000 * 60 * 60 * 24; //24 timer

    const formatNrkUpdatedAt = (timestamp) => {
        if (!Number.isFinite(timestamp)) return "";
        const date = new Date(timestamp);
        if (Number.isNaN(date.getTime())) return "";

        const now = new Date();
        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const diffDays = Math.round((dateOnly - nowOnly) / 86400000);
        const timePart = date.toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" });

        if (diffDays === 0) return `Sist oppdatert i dag kl. ${timePart}`;
        if (diffDays === -1) return `Sist oppdatert i går kl. ${timePart}`;
        const datePart = date.toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit", year: "numeric" });
        return `Sist oppdatert ${datePart} kl. ${timePart}`;
    };

    const loadNrkCache = () => {
        try {
            const raw = localStorage.getItem(NRK_CACHE_KEY);
            if (!raw) return null;
            const cached = JSON.parse(raw);
            if (!cached || !Array.isArray(cached.items)) return null;
            if (!Number.isFinite(cached.timestamp)) return null;
            return cached;
        } catch {
            return null;
        }
    };

    const saveNrkCache = (items, timestamp = Date.now(), source = "live") => {
        try {
            localStorage.setItem(
                NRK_CACHE_KEY,
                JSON.stringify({ timestamp, source, items })
            );
        } catch {
            //ignore quota/storage errors
        }
    };

    const getNrkStaleHint = (timestamp) => {
        if (!Number.isFinite(timestamp)) return "";
        return Date.now() - timestamp > NRK_STALE_WARNING_MS ? " (kan være eldre)" : "";
    };

    const fetchWithTimeout = async (url, timeoutMs = 6500) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const res = await fetch(url, { cache: "no-store", signal: controller.signal });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.text();
        } finally {
            clearTimeout(timeoutId);
        }
    };

    const fetchTextWithFallback = async (urls) => {
        const attempts = urls.map((url) => fetchWithTimeout(url));
        try {
            return await Promise.any(attempts);
        } catch (err) {
            let lastError = err;
            for (const url of urls) {
                try {
                    return await fetchWithTimeout(url, 9000);
                } catch (innerErr) {
                    lastError = innerErr;
                }
            }
            throw lastError || new Error("Ukjent feil");
        }
    };

    const fetchNrkBackupJson = async () => {
        const cacheBuster = Math.floor(Date.now() / (1000 * 60 * 5));
        const url = `data/nrk-news.json?v=${cacheBuster}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`Backup HTTP ${res.status}`);
        const data = await res.json();

        if (!data || !Array.isArray(data.items)) {
            throw new Error("Backup JSON har ugyldig format");
        }

        const parsedItems = data.items
            .map((item) => {
                const title = stripHtml(item?.title || "");
                const category = stripHtml(item?.category || "");
                const link = String(item?.link || "").trim();
                const pubDate = String(item?.pubDate || "").trim();

                return {
                    title,
                    category,
                    link,
                    time: item?.time || formatNrkTime(pubDate),
                };
            })
            .filter((item) => item.title && item.link)
            .slice(0, 4);

        if (!parsedItems.length) {
            throw new Error("Backup JSON inneholder ingen nyheter");
        }

        const backupTimestamp = Number.isFinite(Date.parse(data.updatedAt))
            ? Date.parse(data.updatedAt)
            : Date.now();

        return {
            timestamp: backupTimestamp,
            items: parsedItems,
            source: "backup-json",
        };
    };

    const fetchNrkNews = async () => {
        if (!nrkStatusEl || !nrkListEl) return;
        const cached = loadNrkCache();
        const isFresh = cached && Date.now() - cached.timestamp < NRK_CACHE_TTL;
        let activeItems = cached?.items || [];
        let activeTimestamp = cached?.timestamp || null;
        let activeSource = cached?.source || "local-cache";

        if (cached?.items?.length) {
            renderNrkNews(cached.items);
            const updatedText = formatNrkUpdatedAt(cached.timestamp);
            nrkStatusEl.textContent = isFresh
                ? `Oppdaterer NRK Nyheter... ${updatedText}${getNrkStaleHint(cached.timestamp)}`.trim()
                : `Oppdaterer (lagret versjon kan være eldre)... ${updatedText}${getNrkStaleHint(cached.timestamp)}`.trim();
        } else {
            nrkStatusEl.textContent = "Laster NRK Nyheter...";
        }

        try {
            const backup = await fetchNrkBackupJson();
            if (!activeTimestamp || backup.timestamp > activeTimestamp) {
                activeItems = backup.items;
                activeTimestamp = backup.timestamp;
                activeSource = backup.source;
                renderNrkNews(activeItems);
                saveNrkCache(activeItems, activeTimestamp, activeSource);
                nrkStatusEl.textContent = `${formatNrkUpdatedAt(activeTimestamp)} (backup)${getNrkStaleHint(activeTimestamp)}`;
            }
        } catch (backupError) {
            console.warn("NRK backup JSON-feil:", backupError);
        }

        const proxyUrls = [
            `https://r.jina.ai/http://www.nrk.no/nyheter/siste.rss`,
            `https://api.allorigins.win/raw?url=${encodeURIComponent("https://www.nrk.no/nyheter/siste.rss")}`,
            `https://cors.isomorphic-git.org/https://www.nrk.no/nyheter/siste.rss`,
        ];

        try {
            const xmlText = await fetchTextWithFallback(proxyUrls);
            const doc = new DOMParser().parseFromString(xmlText, "text/xml");
            if (doc.querySelector("parsererror")) {
                throw new Error("RSS parse-feil");
            }
            const items = Array.from(doc.querySelectorAll("item"));

            const parsed = items.slice(0, 4).map((item) => {
                const title = stripHtml(item.querySelector("title")?.textContent || "");
                const pubDate = item.querySelector("pubDate")?.textContent || "";
                const category = stripHtml(item.querySelector("category")?.textContent || "");
                const link = item.querySelector("link")?.textContent || "";

                return {
                    title,
                    time: formatNrkTime(pubDate),
                    category,
                    link,
                };
            });

            if (!parsed.length) {
                nrkStatusEl.textContent = "Fant ingen nyheter.";
                return;
            }

            const updatedAt = Date.now();
            renderNrkNews(parsed);
            saveNrkCache(parsed, updatedAt, "live-rss");
            nrkStatusEl.textContent = formatNrkUpdatedAt(updatedAt);
        } catch (err) {
            console.error("NRK RSS-feil:", err);
            if (activeItems?.length && Number.isFinite(activeTimestamp)) {
                renderNrkNews(activeItems);
                const updatedText = formatNrkUpdatedAt(activeTimestamp);
                const sourceText = activeSource === "backup-json" ? "backup" : "lagrede";
                nrkStatusEl.textContent = `Viser ${sourceText} nyheter. Kunne ikke oppdatere live nå. ${updatedText}${getNrkStaleHint(activeTimestamp)}`.trim();
            } else {
                nrkStatusEl.textContent = "Kunne ikke hente NRK Nyheter.";
            }
        }
    };

    fetchNrkNews();

    //temperatur siste 30 dager (open-meteo)
    function drawTemperatureLineChart(canvas, labels, points, options = {}) {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rootStyles = getComputedStyle(document.documentElement);
        const accent = rootStyles.getPropertyValue("--color").trim() || "189, 150, 255";
        const humidityAccent = rootStyles.getPropertyValue("--color-humidity").trim() || "88, 196, 255";
        const uvAccent = rootStyles.getPropertyValue("--color-uv").trim() || "246, 198, 82";
        const aqiAccent = rootStyles.getPropertyValue("--color-aqi").trim() || "255, 110, 130";
        const successAccent = rootStyles.getPropertyValue("--color-success").trim() || "88, 214, 141";
        const bgElevated = rootStyles.getPropertyValue("--color-bg-elevated").trim() || "8, 14, 24";
        const textBase = rootStyles.getPropertyValue("--color-text-base").trim() || "243, 243, 246";

        const parseRgbTriplet = (value, fallback) => {
            const parts = String(value || "")
                .split(",")
                .map((part) => Number.parseFloat(part.trim()));
            if (parts.length === 3 && parts.every((part) => Number.isFinite(part))) {
                return parts.map((part) => Math.max(0, Math.min(255, Math.round(part))));
            }
            return fallback;
        };
        const blendRgb = (from, to, t) => from.map((channel, idx) => Math.round(channel + (to[idx] - channel) * t));
        const smoothStep = (edge0, edge1, x) => {
            if (edge0 === edge1) return x < edge0 ? 0 : 1;
            const normalized = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
            return normalized * normalized * (3 - 2 * normalized);
        };
        const rgbToCss = (rgb, alpha = 1) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;

        const uvGreen = parseRgbTriplet(successAccent, [0, 255, 90]);
        const uvYellow = parseRgbTriplet(uvAccent, [255, 235, 0]);
        const uvRed = [255, 0, 0];
        const uvPurple = parseRgbTriplet(accent, [175, 0, 255]);
        const uvOrange = blendRgb(uvYellow, uvRed, 0.45);

        const uvBoundaryLow = 2.45;
        const uvBoundaryMid = 5.5;
        const uvBoundaryHigh = 7.5;
        const uvBoundaryExtreme = 10.5;
        const uvTransition = 0.35;

        const getUvRgb = (uvValue) => {
            if (!Number.isFinite(uvValue)) return uvYellow;

            if (uvValue <= uvBoundaryLow - uvTransition) return uvGreen;
            if (uvValue < uvBoundaryLow + uvTransition) {
                const t = smoothStep(uvBoundaryLow - uvTransition, uvBoundaryLow + uvTransition, uvValue);
                return blendRgb(uvGreen, uvYellow, t);
            }

            if (uvValue <= uvBoundaryMid - uvTransition) return uvYellow;
            if (uvValue < uvBoundaryMid + uvTransition) {
                const t = smoothStep(uvBoundaryMid - uvTransition, uvBoundaryMid + uvTransition, uvValue);
                return blendRgb(uvYellow, uvOrange, t);
            }

            if (uvValue <= uvBoundaryHigh - uvTransition) return uvOrange;
            if (uvValue < uvBoundaryHigh + uvTransition) {
                const t = smoothStep(uvBoundaryHigh - uvTransition, uvBoundaryHigh + uvTransition, uvValue);
                return blendRgb(uvOrange, uvRed, t);
            }

            if (uvValue <= uvBoundaryExtreme - uvTransition) return uvRed;
            if (uvValue < uvBoundaryExtreme + uvTransition) {
                const t = smoothStep(uvBoundaryExtreme - uvTransition, uvBoundaryExtreme + uvTransition, uvValue);
                return blendRgb(uvRed, uvPurple, t);
            }

            return uvPurple;
        };

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const width = Math.max(240, rect.width);
        const height = Math.max(140, rect.height);
        canvas.width = width * dpr;
        canvas.height = height * dpr;

        const safePoints = Array.isArray(points) ? points : [];
        const safeHumidityPoints = Array.isArray(options.humidityPoints) ? options.humidityPoints : null;
        const safeUvPoints = Array.isArray(options.uvPoints) ? options.uvPoints : null;
        const safeAqiPoints = Array.isArray(options.aqiPoints) ? options.aqiPoints : null;
        const humidityActive = options.humidityActive === true;
        const uvActive = options.uvActive === true;
        const aqiActive = options.aqiActive === true;
        const gradientAllowed = options.gradientAllowed !== false;
        const animateGradient = options.animateGradient === true;
        const animateTemp = options.animateTemp !== false;
        const animateHumidity = options.animateHumidity !== false;
        const animateUv = options.animateUv !== false;
        const animateAqi = options.animateAqi !== false;
        const animateOutTemp = options.animateOutTemp === true;
        const animateOutHumidity = options.animateOutHumidity === true;
        const animateOutUv = options.animateOutUv === true;
        const animateOutAqi = options.animateOutAqi === true;
        const onComplete = typeof options.onComplete === "function" ? options.onComplete : null;
        const safeLabels = Array.isArray(labels) ? labels : [];
        const tempFormatter = new Intl.NumberFormat("no-NO", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
        });
        const primaryLabel = options.primaryLabel || "Temperatur";
        const primarySuffix = typeof options.primarySuffix === "string" ? options.primarySuffix : "°C";
        const primaryFormatter = options.primaryFormatter || tempFormatter;
        const humidityFormatter = new Intl.NumberFormat("no-NO", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
        const uvFormatter = new Intl.NumberFormat("no-NO", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
        });
        const aqiFormatter = new Intl.NumberFormat("no-NO", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });

        const computeScale = (values, pad = 4) => {
            const finite = Array.isArray(values) ? values.filter((v) => Number.isFinite(v)) : [];
            const maxVal = (finite.length ? Math.max(...finite) : 0) + pad;
            const minVal = (finite.length ? Math.min(...finite) : 0) - pad;
            return { minVal, maxVal };
        };

        const normalizeSeries = (values) => {
            if (!Array.isArray(values)) return [];
            const normalized = values.slice();
            let last = null;
            for (let i = 0; i < normalized.length; i++) {
                if (Number.isFinite(normalized[i])) {
                    last = normalized[i];
                } else if (Number.isFinite(last)) {
                    normalized[i] = last;
                }
            }
            for (let i = normalized.length - 1; i >= 0; i--) {
                if (Number.isFinite(normalized[i])) break;
                for (let j = i - 1; j >= 0; j--) {
                    if (Number.isFinite(normalized[j])) {
                        normalized[i] = normalized[j];
                        break;
                    }
                }
            }
            return normalized;
        };

        const splitFiniteSegments = (pointsArray) => {
            if (!Array.isArray(pointsArray) || !pointsArray.length) return [];
            const segments = [];
            let current = [];

            pointsArray.forEach((point) => {
                const isFinitePoint = point
                    && Number.isFinite(point.x)
                    && Number.isFinite(point.y);

                if (isFinitePoint) {
                    current.push(point);
                    return;
                }

                if (current.length >= 2) segments.push(current);
                current = [];
            });

            if (current.length >= 2) segments.push(current);
            return segments;
        };

        const tempScale = computeScale(safePoints, 4);
        const humidityScale = safeHumidityPoints ? computeScale(safeHumidityPoints, 5) : null;
        const uvScale = safeUvPoints ? computeScale(safeUvPoints, 1) : null;
        const aqiScale = safeAqiPoints ? computeScale(safeAqiPoints, 8) : null;
        const padX = 10;
        const padY = 12;
        const usableW = width - padX * 2;
        const usableH = height - padY * 2;

        const denom = Math.max(1, safeLabels.length - 1);
        const toCoords = (values, scale) =>
            values.map((v, i) => {
                if (!Number.isFinite(v)) return null;
                const x = padX + (usableW * i) / denom;
                const t = (v - scale.minVal) / (scale.maxVal - scale.minVal);
                const y = height - padY - t * usableH;
                return { x, y };
            });

        const coords = toCoords(safePoints, tempScale);
        const humidityCoords = safeHumidityPoints && humidityScale ? toCoords(normalizeSeries(safeHumidityPoints), humidityScale) : null;
        const uvCoords = safeUvPoints && uvScale ? toCoords(safeUvPoints, uvScale) : null;
        const aqiCoords = safeAqiPoints && aqiScale ? toCoords(safeAqiPoints, aqiScale) : null;

        const buildUvStroke = () => {
            if (!Array.isArray(uvCoords) || !uvCoords.length || !usableW) {
                return `rgb(${uvAccent})`;
            }

            const stops = uvCoords
                .map((point, index) => {
                    const value = safeUvPoints[index];
                    if (!point || !Number.isFinite(point.x) || !Number.isFinite(value)) return null;
                    const offset = Math.max(0, Math.min(1, (point.x - padX) / usableW));
                    return { offset, color: getUvRgb(value) };
                })
                .filter(Boolean);

            if (!stops.length) return `rgb(${uvAccent})`;

            if (stops.length === 1) {
                const singleColor = rgbToCss(stops[0].color, 1);
                const singleGradient = ctx.createLinearGradient(padX, 0, width - padX, 0);
                singleGradient.addColorStop(0, singleColor);
                singleGradient.addColorStop(1, singleColor);
                return singleGradient;
            }

            const gradient = ctx.createLinearGradient(padX, 0, width - padX, 0);
            const firstColor = rgbToCss(stops[0].color, 1);
            const lastColor = rgbToCss(stops[stops.length - 1].color, 1);

            if (stops[0].offset > 0) gradient.addColorStop(0, firstColor);
            stops.forEach((stop) => {
                gradient.addColorStop(stop.offset, rgbToCss(stop.color, 1));
            });
            if (stops[stops.length - 1].offset < 1) gradient.addColorStop(1, lastColor);

            return gradient;
        };

        const hasFinite = (values) => Array.isArray(values) && values.some((v) => Number.isFinite(v));
        const hasLineSegments = (coordsArray) => splitFiniteSegments(coordsArray).length > 0;
        const hasTemp = hasFinite(safePoints) && Array.isArray(coords) && hasLineSegments(coords);
        const hasHumidity = hasFinite(safeHumidityPoints) && Array.isArray(humidityCoords) && hasLineSegments(humidityCoords);
        const hasUv = hasFinite(safeUvPoints) && Array.isArray(uvCoords) && hasLineSegments(uvCoords);
        const hasAqi = hasFinite(safeAqiPoints) && Array.isArray(aqiCoords) && hasLineSegments(aqiCoords);
        const baseCoords = hasTemp
            ? coords
            : hasHumidity
                ? humidityCoords
                : hasUv
                    ? uvCoords
                    : hasAqi
                        ? aqiCoords
                        : null;

        function drawBase() {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            //background
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = `rgba(${bgElevated}, 0.55)`;
            ctx.fillRect(0, 0, width, height);

            //grid
            ctx.strokeStyle = `rgba(${textBase}, 0.06)`;
            ctx.lineWidth = 1;
            const gridRows = 4;
            const gridCols = 6;
            for (let r = 1; r < gridRows; r++) {
                const y = (height / gridRows) * r;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }
            for (let c = 1; c < gridCols; c++) {
                const x = (width / gridCols) * c;
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
        }

        let hoverIndex = -1;
        let hoverPos = null;
        let interactiveReady = false;
        const hitRadius = 10;

        function drawSmoothPath(pointsArray) {
            if (!pointsArray || pointsArray.length < 2) return;
            const segments = splitFiniteSegments(pointsArray);
            if (!segments.length) return;
            const tension = 0.5;
            segments.forEach((segment) => {
                ctx.beginPath();
                ctx.moveTo(segment[0].x, segment[0].y);
                for (let i = 0; i < segment.length - 1; i++) {
                    const p0 = segment[i - 1] || segment[i];
                    const p1 = segment[i];
                    const p2 = segment[i + 1];
                    const p3 = segment[i + 2] || p2;

                    const cp1x = p1.x + ((p2.x - p0.x) / 6) * tension;
                    const cp1y = p1.y + ((p2.y - p0.y) / 6) * tension;
                    const cp2x = p2.x - ((p3.x - p1.x) / 6) * tension;
                    const cp2y = p2.y - ((p3.y - p1.y) / 6) * tension;

                    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
                }
                ctx.stroke();
            });
        }

        function drawTooltip(pos, label, value, humidityValue, uvValue, aqiValue) {
            if (!pos) return;
            const paddingX = 10;
            const paddingY = 8;
            const lineHeight = 16;
            const lines = [label];
            if (Number.isFinite(value)) {
                const formatted = primaryFormatter.format(value);
                const suffix = primarySuffix ? `${primarySuffix}` : "";
                lines.push(`${primaryLabel}: ${formatted}${suffix}`);
            }
            if (Number.isFinite(humidityValue)) {
                lines.push(`Fuktighet: ${humidityFormatter.format(humidityValue)}%`);
            }
            if (Number.isFinite(uvValue)) {
                lines.push(`UV-indeks: ${uvFormatter.format(uvValue)}`);
            }
            if (Number.isFinite(aqiValue)) {
                lines.push(`Luftkvalitet (AQI): ${aqiFormatter.format(aqiValue)}`);
            }

            ctx.font = "12px system-ui, -apple-system, Segoe UI, sans-serif";
            const widths = lines.map((line) => ctx.measureText(line).width);
            const boxW = Math.max(...widths) + paddingX * 2;
            const boxH = paddingY * 2 + lineHeight * lines.length;

            let x = pos.x + 12;
            let y = pos.y - boxH - 12;
            if (x + boxW > width) x = width - boxW - 6;
            if (y < 6) y = pos.y + 12;

            const radius = 8;
            ctx.fillStyle = `rgba(${bgElevated}, 0.92)`;
            ctx.strokeStyle = `rgba(${textBase}, 0.12)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + boxW - radius, y);
            ctx.quadraticCurveTo(x + boxW, y, x + boxW, y + radius);
            ctx.lineTo(x + boxW, y + boxH - radius);
            ctx.quadraticCurveTo(x + boxW, y + boxH, x + boxW - radius, y + boxH);
            ctx.lineTo(x + radius, y + boxH);
            ctx.quadraticCurveTo(x, y + boxH, x, y + boxH - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = `rgba(${textBase}, 0.92)`;
            lines.forEach((line, idx) => {
                ctx.fillText(line, x + paddingX, y + paddingY + lineHeight * (idx + 1) - 3);
            });
        }

        function render(progress) {
            drawBase();

            if (!baseCoords || baseCoords.length < 2) {
                return;
            }

            const tempProgress = animateOutTemp ? 1 - progress : animateTemp ? progress : 1;
            const humidityProgress = animateOutHumidity ? 1 - progress : animateHumidity ? progress : 1;
            const uvProgress = animateOutUv ? 1 - progress : animateUv ? progress : 1;
            const aqiProgress = animateOutAqi ? 1 - progress : animateAqi ? progress : 1;
            const gradientOpacity = gradientAllowed
                ? animateGradient
                    ? progress
                    : 1
                : animateGradient
                    ? 1 - progress
                    : 0;

            const totalSegments = baseCoords.length - 1;
            const progressSegments = totalSegments * progress;
            const lastIndex = Math.floor(progressSegments);
            const t = progressSegments - lastIndex;

            //gradient fill under line
            ctx.save();
            ctx.beginPath();
            ctx.rect(0, 0, width * tempProgress, height);
            ctx.clip();
            if (hasTemp && gradientOpacity > 0) {
                ctx.beginPath();
                drawSmoothPath(coords);
                ctx.lineTo(coords[coords.length - 1].x, height - padY);
                ctx.lineTo(coords[0].x, height - padY);
                ctx.closePath();
                const fillGradient = ctx.createLinearGradient(0, padY, 0, height - padY);
                fillGradient.addColorStop(0, `rgba(${accent}, ${1 * gradientOpacity})`);
                fillGradient.addColorStop(1, `rgba(${accent}, 0.0)`);
                ctx.fillStyle = fillGradient;
                ctx.fill();
            }
            ctx.restore();

            //smooth line
            if (hasTemp) {
                ctx.save();
                ctx.beginPath();
                ctx.rect(0, 0, width * tempProgress, height);
                ctx.clip();
                ctx.strokeStyle = `rgb(${accent})`;
                ctx.lineWidth = 2.5;
                drawSmoothPath(coords);
                ctx.restore();
            }

            if (hasHumidity) {
                ctx.save();
                ctx.beginPath();
                ctx.rect(0, 0, width * humidityProgress, height);
                ctx.clip();
                if (gradientOpacity > 0) {
                    ctx.beginPath();
                    drawSmoothPath(humidityCoords);
                    ctx.lineTo(humidityCoords[humidityCoords.length - 1].x, height - padY);
                    ctx.lineTo(humidityCoords[0].x, height - padY);
                    ctx.closePath();
                    const humidityFill = ctx.createLinearGradient(0, padY, 0, height - padY);
                    humidityFill.addColorStop(0, `rgba(${humidityAccent}, ${0.22 * gradientOpacity})`);
                    humidityFill.addColorStop(1, `rgba(${humidityAccent}, 0.0)`);
                    ctx.fillStyle = humidityFill;
                    ctx.fill();
                }
                ctx.restore();

                ctx.save();
                ctx.beginPath();
                ctx.rect(0, 0, width * humidityProgress, height);
                ctx.clip();
                ctx.strokeStyle = `rgb(${humidityAccent})`;
                ctx.lineWidth = 2;
                drawSmoothPath(humidityCoords);
                ctx.restore();
            }

            if (hasUv) {
                ctx.save();
                ctx.beginPath();
                ctx.rect(0, 0, width * uvProgress, height);
                ctx.clip();
                ctx.strokeStyle = buildUvStroke();
                ctx.lineWidth = 2;
                drawSmoothPath(uvCoords);
                ctx.restore();
            }

            if (hasAqi) {
                ctx.save();
                ctx.beginPath();
                ctx.rect(0, 0, width * aqiProgress, height);
                ctx.clip();
                ctx.strokeStyle = `rgb(${aqiAccent})`;
                ctx.setLineDash([6, 6]);
                ctx.lineWidth = 2;
                drawSmoothPath(aqiCoords);
                ctx.setLineDash([]);
                ctx.restore();
            }

            //hover point + tooltip
            if (hoverIndex >= 0 && interactiveReady && baseCoords) {
                const p = baseCoords[hoverIndex];
                if (!p || !Number.isFinite(p.x) || !Number.isFinite(p.y)) return;
                ctx.save();
                ctx.strokeStyle = `rgba(${textBase}, 0.22)`;
                ctx.lineWidth = 1;
                ctx.setLineDash([4, 6]);
                ctx.beginPath();
                ctx.moveTo(p.x, padY);
                ctx.lineTo(p.x, height - padY);
                ctx.stroke();
                ctx.restore();

                if (hasTemp) {
                    const tp = coords[hoverIndex];
                    if (tp && Number.isFinite(tp.x) && Number.isFinite(tp.y)) {
                        ctx.fillStyle = `rgba(${accent}, 0.95)`;
                        ctx.beginPath();
                        ctx.arc(tp.x, tp.y, 4, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.strokeStyle = `rgba(${textBase}, 0.25)`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.arc(tp.x, tp.y, 7, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }

                if (hasHumidity) {
                    const hp = humidityCoords[hoverIndex];
                    if (hp && Number.isFinite(hp.x) && Number.isFinite(hp.y)) {
                        ctx.fillStyle = `rgba(${humidityAccent}, 0.95)`;
                        ctx.beginPath();
                        ctx.arc(hp.x, hp.y, 3.5, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.strokeStyle = `rgba(${textBase}, 0.25)`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.arc(hp.x, hp.y, 6.5, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }

                if (hasUv) {
                    const up = uvCoords[hoverIndex];
                    if (up && Number.isFinite(up.x) && Number.isFinite(up.y)) {
                        const uvColor = getUvRgb(safeUvPoints[hoverIndex]);
                        ctx.fillStyle = rgbToCss(uvColor, 1);
                        ctx.beginPath();
                        ctx.arc(up.x, up.y, 3.5, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.strokeStyle = `rgba(${textBase}, 0.25)`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.arc(up.x, up.y, 6.5, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }

                if (hasAqi) {
                    const ap = aqiCoords[hoverIndex];
                    if (ap && Number.isFinite(ap.x) && Number.isFinite(ap.y)) {
                        ctx.fillStyle = `rgba(${aqiAccent}, 0.95)`;
                        ctx.beginPath();
                        ctx.arc(ap.x, ap.y, 3.5, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.strokeStyle = `rgba(${textBase}, 0.25)`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.arc(ap.x, ap.y, 6.5, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }

                const tempValue = hasTemp ? safePoints[hoverIndex] : null;
                const humidityValue = hasHumidity ? safeHumidityPoints[hoverIndex] : null;
                const uvValue = hasUv ? safeUvPoints[hoverIndex] : null;
                const aqiValue = hasAqi ? safeAqiPoints[hoverIndex] : null;
                drawTooltip(hoverPos, safeLabels[hoverIndex], tempValue, humidityValue, uvValue, aqiValue);
            }
        }

        const duration = 900;
        const start = performance.now();
        function animate(now) {
            const progress = Math.min(1, (now - start) / duration);
            render(progress);
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                interactiveReady = true;
                if (onComplete) onComplete();
            }
        }
        requestAnimationFrame(animate);

        function getMousePos(evt) {
            const box = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - box.left,
                y: evt.clientY - box.top,
            };
        }

        function findNearestPoint(pos) {
            let nearest = -1;
            let minDist = Infinity;
            const targets = baseCoords || [];
            for (let i = 0; i < targets.length; i++) {
                const point = targets[i];
                if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) continue;
                const dx = Math.abs(pos.x - point.x);
                if (dx < minDist) {
                    minDist = dx;
                    nearest = i;
                }
            }
            return nearest;
        }

        canvas.addEventListener("mousemove", (evt) => {
            if (!interactiveReady) return;
            const pos = getMousePos(evt);
            const idx = findNearestPoint(pos);
            hoverIndex = idx;
            hoverPos = idx >= 0 ? pos : null;
            render(1);
        });

        canvas.addEventListener("mouseleave", () => {
            if (!interactiveReady) return;
            hoverIndex = -1;
            hoverPos = null;
            render(1);
        });
    }

    function replaceAndDrawTrendChart(labels, points, options = {}) {
        const current = document.getElementById("trendChart");
        if (!current || !current.parentNode) return;
        const fresh = current.cloneNode(true);
        current.parentNode.replaceChild(fresh, current);
        drawTemperatureLineChart(fresh, labels, points, options);
    }

    const dayFormatter = new Intl.DateTimeFormat("no-NO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    function formatDateYmd(d) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    function getLastDaysRange(days = 30) {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - (days - 1));
        return { start, end };
    }

    function getRangeForKey(rangeKey) {
        const today = new Date();
        if (rangeKey === "1y") {
            return getLastDaysRange(365);
        }
        if (rangeKey === "ytd") {
            return { start: new Date(today.getFullYear(), 0, 1), end: today };
        }
        if (rangeKey === "5y") {
            return getLastDaysRange(365 * 5);
        }
        return getLastDaysRange(30);
    }

    function buildDayKeysForRange(rangeKey) {
        const { start, end } = getRangeForKey(rangeKey);
        const days = [];
        const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());

        while (cursor <= last) {
            days.push(formatDateYmd(cursor));
            cursor.setDate(cursor.getDate() + 1);
        }

        return days;
    }

    const toIsoStartOfDay = (date) => {
        const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
        return utc.toISOString();
    };

    const toIsoEndOfDay = (date) => {
        const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59));
        return utc.toISOString();
    };

    async function fetchTemperaturesForRange(lat, lon, rangeKey) {
        const { start, end } = getRangeForKey(rangeKey);
        const startDate = formatDateYmd(start);
        const endDate = formatDateYmd(end);

        const url =
            "https://archive-api.open-meteo.com/v1/archive" +
            `?latitude=${encodeURIComponent(lat)}` +
            `&longitude=${encodeURIComponent(lon)}` +
            `&start_date=${startDate}` +
            `&end_date=${endDate}` +
            `&daily=temperature_2m_mean,relative_humidity_2m_mean` +
            `&timezone=Europe%2FOslo`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Vær-API feil: ${res.status} ${res.statusText}`);
        const data = await res.json();

        const days = data?.daily?.time || [];
        const temps = data?.daily?.temperature_2m_mean || [];
        const humidity = data?.daily?.relative_humidity_2m_mean || [];

        const labels = days.map((d) => dayFormatter.format(new Date(d)));
        const values = temps.map((t) => (Number.isFinite(t) ? t : null));
        const humidityValues = humidity.map((h) => (Number.isFinite(h) ? h : null));

        return { labels, values, humidity: humidityValues, days };
    }

    const mapDailySeries = (days = [], seriesDays = [], seriesValues = []) => {
        const valueMap = new Map();
        seriesDays.forEach((d, idx) => {
            const v = seriesValues[idx];
            valueMap.set(d, Number.isFinite(v) ? v : null);
        });
        return days.map((d) => (valueMap.has(d) ? valueMap.get(d) : null));
    };

    const getSeriesBounds = (values = []) => {
        let min = Infinity;
        let max = -Infinity;

        values.forEach((value) => {
            if (!Number.isFinite(value)) return;
            if (value < min) min = value;
            if (value > max) max = value;
        });

        if (min === Infinity || max === -Infinity) return null;
        return { min, max };
    };

    const hasFiniteSeries = (values) => Array.isArray(values) && values.some((v) => Number.isFinite(v));
    const hasNonZeroSeries = (values, epsilon = 1e-9) =>
        Array.isArray(values) && values.some((v) => Number.isFinite(v) && Math.abs(v) > epsilon);

    const OM_UV_CACHE_PREFIX = "omUvDailyCacheV1";
    const OM_UV_CACHE_MAX_DAYS = 365 * 6;
    const OM_UV_SHARED_URL = "data/uv-history.json";
    const OM_UV_SHARED_MAX_DISTANCE_KM = 350;
    let sharedUvHistoryPromise = null;
    let sharedUvUpdatedAt = null;
    let sharedUvSource = null;
    const omYearToDateExtremesCache = new Map();
    const omYearToDateExtremesPending = new Map();

    const toUvLocationKey = (lat, lon) => {
        const safeLat = Number(lat);
        const safeLon = Number(lon);
        return `${safeLat.toFixed(4)},${safeLon.toFixed(4)}`;
    };

    const toRadians = (degrees) => (Number(degrees) * Math.PI) / 180;

    const getDistanceKm = (lat1, lon1, lat2, lon2) => {
        const aLat = Number(lat1);
        const aLon = Number(lon1);
        const bLat = Number(lat2);
        const bLon = Number(lon2);
        if (![aLat, aLon, bLat, bLon].every((v) => Number.isFinite(v))) return Infinity;

        const earthRadiusKm = 6371;
        const dLat = toRadians(bLat - aLat);
        const dLon = toRadians(bLon - aLon);
        const h =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(aLat)) * Math.cos(toRadians(bLat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        return earthRadiusKm * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
    };

    const toUvValueMap = (valuesObj) => {
        const map = new Map();
        if (!valuesObj || typeof valuesObj !== "object") return map;

        Object.entries(valuesObj).forEach(([day, value]) => {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return;
            if (!Number.isFinite(value)) return;
            map.set(day, value);
        });

        return map;
    };

    const getUvCacheKey = (lat, lon) => {
        return `${OM_UV_CACHE_PREFIX}:${toUvLocationKey(lat, lon)}`;
    };

    const loadSharedUvHistory = async () => {
        if (!sharedUvHistoryPromise) {
            sharedUvHistoryPromise = fetch(OM_UV_SHARED_URL, { cache: "no-cache" })
                .then((res) => {
                    if (!res.ok) return null;
                    return res.json();
                })
                .catch(() => null);
        }
        return sharedUvHistoryPromise;
    };

    const getSharedUvMapForLocation = async (lat, lon) => {
        const shared = await loadSharedUvHistory();
        sharedUvUpdatedAt = shared?.updatedAt || null;
        sharedUvSource = shared?.source || null;
        const locations = shared?.locations;
        if (!locations || typeof locations !== "object") {
            return { map: new Map(), updatedAt: sharedUvUpdatedAt };
        }

        const exactValues = locations[toUvLocationKey(lat, lon)] || null;
        const exactMap = toUvValueMap(exactValues);
        if (exactMap.size) {
            return { map: exactMap, updatedAt: sharedUvUpdatedAt };
        }

        let nearest = null;
        Object.entries(locations).forEach(([locationKey, locationValues]) => {
            if (!locationValues || typeof locationValues !== "object") return;
            const [rawLat, rawLon] = locationKey.split(",");
            const distanceKm = getDistanceKm(lat, lon, Number(rawLat), Number(rawLon));
            if (!Number.isFinite(distanceKm) || distanceKm > OM_UV_SHARED_MAX_DISTANCE_KM) return;

            if (!nearest || distanceKm < nearest.distanceKm) {
                nearest = {
                    key: locationKey,
                    values: locationValues,
                    distanceKm,
                };
            }
        });

        if (!nearest) {
            return { map: new Map(), updatedAt: sharedUvUpdatedAt };
        }

        const nearestMap = toUvValueMap(nearest.values);
        if (!nearestMap.size) {
            return { map: new Map(), updatedAt: sharedUvUpdatedAt };
        }

        const nearestLabel = `${nearest.key} (${nearest.distanceKm.toFixed(0)} km)`;
        sharedUvSource = sharedUvSource ? `${sharedUvSource};nearest:${nearestLabel}` : `nearest:${nearestLabel}`;

        return { map: nearestMap, updatedAt: sharedUvUpdatedAt };
    };

    const loadUvCacheMap = (lat, lon) => {
        try {
            const raw = localStorage.getItem(getUvCacheKey(lat, lon));
            if (!raw) return new Map();
            const parsed = JSON.parse(raw);
            const values = parsed?.values;
            if (!values || typeof values !== "object") return new Map();

            const map = new Map();
            Object.entries(values).forEach(([day, value]) => {
                if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return;
                if (!Number.isFinite(value)) return;
                map.set(day, value);
            });
            return map;
        } catch {
            return new Map();
        }
    };

    const saveUvCacheMap = (lat, lon, uvMap) => {
        if (!(uvMap instanceof Map) || !uvMap.size) return;
        try {
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - OM_UV_CACHE_MAX_DAYS);
            const cutoffKey = formatDateYmd(cutoff);
            const pruned = {};

            uvMap.forEach((value, day) => {
                if (day < cutoffKey) return;
                if (!Number.isFinite(value)) return;
                pruned[day] = value;
            });

            localStorage.setItem(
                getUvCacheKey(lat, lon),
                JSON.stringify({
                    updatedAt: Date.now(),
                    values: pruned,
                })
            );
        } catch {
            // ignore quota/storage errors
        }
    };

    const mergeDailySeriesIntoCache = (uvMap, seriesDays = [], seriesValues = []) => {
        if (!(uvMap instanceof Map)) return;
        seriesDays.forEach((day, idx) => {
            const value = seriesValues[idx];
            if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return;
            if (!Number.isFinite(value)) return;
            uvMap.set(day, value);
        });
    };

    async function fetchUvIndexForRange(lat, lon, rangeKey, days = []) {
        const { start, end } = getRangeForKey(rangeKey);
        const startDate = formatDateYmd(start);
        const endDate = formatDateYmd(end);
        const uvCache = loadUvCacheMap(lat, lon);
        const sharedUv = await getSharedUvMapForLocation(lat, lon);
        sharedUv.map.forEach((value, day) => uvCache.set(day, value));

        const archiveUrl =
            "https://archive-api.open-meteo.com/v1/archive" +
            `?latitude=${encodeURIComponent(lat)}` +
            `&longitude=${encodeURIComponent(lon)}` +
            `&start_date=${startDate}` +
            `&end_date=${endDate}` +
            `&daily=uv_index_max` +
            `&timezone=Europe%2FOslo`;

        let archiveMapped = null;
        try {
            const archiveRes = await fetch(archiveUrl);
            if (!archiveRes.ok) throw new Error(`UV-API feil: ${archiveRes.status} ${archiveRes.statusText}`);
            const archiveData = await archiveRes.json();
            const uvDays = archiveData?.daily?.time || [];
            const uvValues = archiveData?.daily?.uv_index_max || [];
            mergeDailySeriesIntoCache(uvCache, uvDays, uvValues);
            archiveMapped = mapDailySeries(days, uvDays, uvValues);
        } catch {
            archiveMapped = null;
        }

        const recentDays = Math.min(Math.max(days.length, 1), 30);
        const forecastUrl =
            "https://api.open-meteo.com/v1/forecast" +
            `?latitude=${encodeURIComponent(lat)}` +
            `&longitude=${encodeURIComponent(lon)}` +
            `&daily=uv_index_max` +
            `&past_days=${recentDays}` +
            `&forecast_days=1` +
            `&timezone=Europe%2FOslo`;

        let forecastMapped = null;
        let forecastError = null;

        try {
            const forecastRes = await fetch(forecastUrl);
            if (!forecastRes.ok) throw new Error(`UV-forecast feil: ${forecastRes.status} ${forecastRes.statusText}`);
            const forecastData = await forecastRes.json();
            const fDays = forecastData?.daily?.time || [];
            const fValues = forecastData?.daily?.uv_index_max || [];
            mergeDailySeriesIntoCache(uvCache, fDays, fValues);
            forecastMapped = mapDailySeries(days, fDays, fValues);
        } catch (err) {
            forecastError = err;
        }

        saveUvCacheMap(lat, lon, uvCache);
        const cachedMapped = days.map((day) => (uvCache.has(day) ? uvCache.get(day) : null));
        if (hasFiniteSeries(cachedMapped)) return cachedMapped;
        if (hasFiniteSeries(forecastMapped)) return forecastMapped;
        if (hasFiniteSeries(archiveMapped)) return archiveMapped;
        if (forecastError) throw forecastError;
        return days.map(() => null);
    }

    async function fetchAqiForRange(lat, lon, rangeKey, days = []) {
        const { start, end } = getRangeForKey(rangeKey);
        const startDate = formatDateYmd(start);
        const endDate = formatDateYmd(end);

        const url =
            "https://air-quality-api.open-meteo.com/v1/air-quality" +
            `?latitude=${encodeURIComponent(lat)}` +
            `&longitude=${encodeURIComponent(lon)}` +
            `&start_date=${startDate}` +
            `&end_date=${endDate}` +
            `&hourly=european_aqi` +
            `&timezone=Europe%2FOslo`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`AQI-API feil: ${res.status} ${res.statusText}`);
        const data = await res.json();

        const times = data?.hourly?.time || [];
        const values = data?.hourly?.european_aqi || [];
        const dayBuckets = new Map();

        times.forEach((time, idx) => {
            const dayKey = typeof time === "string" ? time.slice(0, 10) : null;
            const v = values[idx];
            if (!dayKey || !Number.isFinite(v)) return;
            if (!dayBuckets.has(dayKey)) {
                dayBuckets.set(dayKey, { sum: 0, count: 0 });
            }
            const bucket = dayBuckets.get(dayKey);
            bucket.sum += v;
            bucket.count += 1;
        });

        return days.map((d) => {
            const bucket = dayBuckets.get(d);
            if (!bucket || !bucket.count) return null;
            return bucket.sum / bucket.count;
        });
    }

    async function fetchTemperatureBoundsForRange(lat, lon, rangeKey) {
        const { start, end } = getRangeForKey(rangeKey);
        const startDate = formatDateYmd(start);
        const endDate = formatDateYmd(end);

        const url =
            "https://archive-api.open-meteo.com/v1/archive" +
            `?latitude=${encodeURIComponent(lat)}` +
            `&longitude=${encodeURIComponent(lon)}` +
            `&start_date=${startDate}` +
            `&end_date=${endDate}` +
            `&daily=temperature_2m_min,temperature_2m_max` +
            `&timezone=Europe%2FOslo`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Vær-API feil: ${res.status} ${res.statusText}`);
        const data = await res.json();

        const dailyMin = data?.daily?.temperature_2m_min || [];
        const dailyMax = data?.daily?.temperature_2m_max || [];
        const minBounds = getSeriesBounds(dailyMin);
        const maxBounds = getSeriesBounds(dailyMax);

        if (!minBounds && !maxBounds) {
            return { min: null, max: null };
        }

        return {
            min: minBounds ? minBounds.min : null,
            max: maxBounds ? maxBounds.max : null,
        };
    }

    const getYearToDateExtremesForLocation = async (lat, lon) => {
        const cacheKey = `${toUvLocationKey(lat, lon)}:${formatDateYmd(new Date())}`;
        if (omYearToDateExtremesCache.has(cacheKey)) {
            return omYearToDateExtremesCache.get(cacheKey);
        }
        if (omYearToDateExtremesPending.has(cacheKey)) {
            return omYearToDateExtremesPending.get(cacheKey);
        }

        const pending = (async () => {
            const ytdDays = buildDayKeysForRange("ytd");
            const [tempResult, uvResult] = await Promise.allSettled([
                fetchTemperatureBoundsForRange(lat, lon, "ytd"),
                fetchUvIndexForRange(lat, lon, "ytd", ytdDays),
            ]);

            const temp = tempResult.status === "fulfilled" ? tempResult.value : null;
            const uvBounds = uvResult.status === "fulfilled" ? getSeriesBounds(uvResult.value) : null;
            const stats = {
                tempMin: Number.isFinite(temp?.min) ? temp.min : null,
                tempMax: Number.isFinite(temp?.max) ? temp.max : null,
                uvMin: Number.isFinite(uvBounds?.min) ? uvBounds.min : null,
                uvMax: Number.isFinite(uvBounds?.max) ? uvBounds.max : null,
            };

            omYearToDateExtremesCache.set(cacheKey, stats);
            return stats;
        })().finally(() => {
            omYearToDateExtremesPending.delete(cacheKey);
        });

        omYearToDateExtremesPending.set(cacheKey, pending);
        return pending;
    };

    const omStatusEl = document.getElementById("omStatus");
    const omUvUpdatedAtEl = document.getElementById("omUvUpdatedAt");
    const omUvSourceInfoEl = document.getElementById("omUvSourceInfo");
    const omRangeSelector = document.getElementById("omRangeSelector");
    const omRangeButtons = omRangeSelector
        ? Array.from(omRangeSelector.querySelectorAll("[data-range]"))
        : [];
    const omRangeIndicator = omRangeSelector
        ? omRangeSelector.querySelector(".range-selector__indicator")
        : null;
    const trendChartTile = document.getElementById("trendChartTile");
    const weatherSummaryChipsEl = document.getElementById("weatherSummaryChips");
    const weatherAlertsEl = document.getElementById("weatherAlerts");
    const weatherForecastGridEl = document.getElementById("weatherForecastGrid");
    const weatherForecastStatusEl = document.getElementById("weatherForecastStatus");
    const weatherForecastUpdatedEl = document.getElementById("weatherForecastUpdated");
    const weatherNowSceneEl = document.getElementById("weatherNowScene");
    const weatherNowRainLayerEl = weatherNowSceneEl?.querySelector(".weather-scene__rain") || null;
    const weatherNowTempEl = document.getElementById("weatherNowTemp");
    const weatherNowConditionEl = document.getElementById("weatherNowCondition");
    const weatherNowLocationLabelEl = document.getElementById("weatherNowLocationLabel");
    const weatherNowLoadingOverlayEl = document.getElementById("weatherNowLoadingOverlay");

    const applyLucideIcons = () => {
        if (typeof window === "undefined") return;
        if (!window.lucide || typeof window.lucide.createIcons !== "function") return;
        window.lucide.createIcons();
    };

    applyLucideIcons();

    let activeWeatherLocationLabel = "Oslo, Norge";
    let weatherNowLoadingRequestCount = 0;

    const setWeatherNowLocationLoading = (isLoading) => {
        weatherNowLoadingRequestCount = isLoading
            ? weatherNowLoadingRequestCount + 1
            : Math.max(0, weatherNowLoadingRequestCount - 1);

        const active = weatherNowLoadingRequestCount > 0;
        if (weatherNowSceneEl) {
            weatherNowSceneEl.classList.toggle("is-updating", active);
            weatherNowSceneEl.setAttribute("aria-busy", active ? "true" : "false");
        }
        if (weatherNowLocationLabelEl) {
            weatherNowLocationLabelEl.classList.toggle("is-updating", active);
        }
        if (weatherNowLoadingOverlayEl) {
            weatherNowLoadingOverlayEl.setAttribute("aria-hidden", active ? "false" : "true");
        }
    };

    const formatLocationFromCoords = (lat, lon) => {
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) return "";
        return `${Number(lat).toFixed(2)}, ${Number(lon).toFixed(2)}`;
    };

    const setWeatherLocationLabel = ({ label = "", lat = null, lon = null } = {}) => {
        const clean = String(label || "").trim();
        const fallbackCoords = formatLocationFromCoords(lat, lon);
        const nextLabel = clean || fallbackCoords || activeWeatherLocationLabel || "Ukjent sted";
        activeWeatherLocationLabel = nextLabel;
        if (weatherNowLocationLabelEl) {
            weatherNowLocationLabelEl.textContent = nextLabel;
        }
    };

    const setOmStatus = (msg) => {
        if (omStatusEl) omStatusEl.textContent = msg;
    };

    const formatSharedUvUpdatedAt = (isoStr) => {
        if (!isoStr) return "";
        const date = new Date(isoStr);
        if (Number.isNaN(date.getTime())) return "";
        const datePart = date.toLocaleDateString("nb-NO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        const timePart = date.toLocaleTimeString("nb-NO", {
            hour: "2-digit",
            minute: "2-digit",
        });
        return `Delt UV-data sist oppdatert: ${datePart} kl. ${timePart}`;
    };

    const formatSharedUvSource = (source) => {
        if (!source) return "Hentet fra Open-Meteo";

        const raw = String(source);
        const [baseSource, ...metaParts] = raw.split(";");
        const nearestMeta = metaParts.find((part) => part.trim().startsWith("nearest:"));
        const nearestText = nearestMeta
            ? `, bruker naermeste delte punkt (${nearestMeta.replace(/^\s*nearest:/, "").trim()})`
            : "";

        if (baseSource.includes("open-meteo")) {
            if (baseSource.includes("archive") && baseSource.includes("forecast")) {
                return `Hentet fra Open-Meteo (archive + forecast)${nearestText}`;
            }
            if (baseSource.includes("forecast")) {
                return `Hentet fra Open-Meteo (forecast)${nearestText}`;
            }
            if (baseSource.includes("archive")) {
                return `Hentet fra Open-Meteo (archive)${nearestText}`;
            }
            return `Hentet fra Open-Meteo${nearestText}`;
        }

        return `Hentet fra: ${baseSource}${nearestText}`;
    };

    const formatMetricValue = (value, unit = "", digits = 1) => {
        if (!Number.isFinite(value)) return "-";
        return `${value.toLocaleString("nb-NO", {
            minimumFractionDigits: digits,
            maximumFractionDigits: digits,
        })}${unit}`;
    };

    const formatYearToDateExtremes = (stats) => {
        if (!stats) return "";
        const hasTemp = Number.isFinite(stats.tempMin) || Number.isFinite(stats.tempMax);
        const hasUv = Number.isFinite(stats.uvMin) || Number.isFinite(stats.uvMax);
        if (!hasTemp && !hasUv) return "";

        const tempText = `laveste/høyeste temp ${formatMetricValue(stats.tempMin, " °C", 1)} / ${formatMetricValue(stats.tempMax, " °C", 1)}`;
        const uvText = `laveste/høyeste UV ${formatMetricValue(stats.uvMin, "", 2)} / ${formatMetricValue(stats.uvMax, "", 2)}`;
        return `Målt hittil i år: ${tempText}, ${uvText}`;
    };

    const setOmUvUpdatedAtStatus = (yearToDateStats = null) => {
        if (!omUvUpdatedAtEl) return;
        const text = formatSharedUvUpdatedAt(sharedUvUpdatedAt);
        const baseText = text || "Delt UV-data: venter på første oppdatering.";
        const ytdText = formatYearToDateExtremes(yearToDateStats);
        omUvUpdatedAtEl.textContent = ytdText ? `${baseText} | ${ytdText}` : baseText;
        if (omUvSourceInfoEl) {
            const sourceText = formatSharedUvSource(sharedUvSource);
            omUvSourceInfoEl.dataset.tooltip = sourceText;
            omUvSourceInfoEl.removeAttribute("title");
        }
    };

    const setTrendChartLoading = (isLoading) => {
        if (!trendChartTile) return;
        trendChartTile.classList.toggle("is-loading", Boolean(isLoading));
    };

    const OM_OSLO_TIMEZONE = "Europe/Oslo";
    const OM_YR_CACHE_TTL_MS = 1000 * 60 * 15;
    const yrForecastCache = new Map();
    const yrForecastPending = new Map();
    const OM_YR_NOW_CACHE_TTL_MS = 1000 * 60 * 10;
    const OM_YR_AQI_SCALE_FACTOR = 20;
    const yrCurrentSummaryCache = new Map();
    const yrCurrentSummaryPending = new Map();

    const formatWeatherValue = (value, suffix = "", digits = 1) => {
        if (!Number.isFinite(value)) return "-";
        return `${value.toLocaleString("nb-NO", {
            minimumFractionDigits: digits,
            maximumFractionDigits: digits,
        })}${suffix}`;
    };

    const createEmptyWeatherSummary = () => ({
        temp: null,
        humidity: null,
        uv: null,
        aqi: null,
        symbol: "",
        precipMm: null,
    });

    const getYrNowCacheKey = (lat, lon) => `${Number(lat).toFixed(3)},${Number(lon).toFixed(3)}`;

    const pickCurrentMetAqi = (timeEntries = []) => {
        if (!Array.isArray(timeEntries) || !timeEntries.length) return null;

        const now = Date.now();
        let nearestFuture = null;

        for (const entry of timeEntries) {
            const value = entry?.variables?.AQI?.value;
            if (!Number.isFinite(value)) continue;

            const fromMs = Date.parse(entry?.from || "");
            const toMs = Date.parse(entry?.to || "");

            if (Number.isFinite(fromMs) && Number.isFinite(toMs) && now >= fromMs && now < toMs) {
                return value;
            }

            if (Number.isFinite(fromMs) && fromMs >= now) {
                if (!nearestFuture || fromMs < nearestFuture.fromMs) {
                    nearestFuture = { fromMs, value };
                }
            }
        }

        if (nearestFuture) return nearestFuture.value;

        for (let i = timeEntries.length - 1; i >= 0; i -= 1) {
            const value = timeEntries[i]?.variables?.AQI?.value;
            if (Number.isFinite(value)) return value;
        }

        return null;
    };

    const fetchYrCurrentSummaryForCoords = async (lat, lon) => {
        const cacheKey = getYrNowCacheKey(lat, lon);
        const cached = yrCurrentSummaryCache.get(cacheKey);
        if (cached && Date.now() - cached.fetchedAt < OM_YR_NOW_CACHE_TTL_MS) {
            return cached.value;
        }

        if (yrCurrentSummaryPending.has(cacheKey)) {
            return yrCurrentSummaryPending.get(cacheKey);
        }

        const pending = (async () => {
            const weatherUrl =
                "https://api.met.no/weatherapi/locationforecast/2.0/complete" +
                `?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;

            const aqiUrl =
                "https://api.met.no/weatherapi/airqualityforecast/0.1/" +
                `?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;

            const [weatherResult, aqiResult] = await Promise.allSettled([
                fetch(weatherUrl, { headers: { Accept: "application/json" } })
                    .then((response) => {
                        if (!response.ok) throw new Error(`Yr locationforecast-feil: ${response.status}`);
                        return response.json();
                    }),
                fetch(aqiUrl, { headers: { Accept: "application/json" } })
                    .then((response) => {
                        if (!response.ok) throw new Error(`Yr airquality-feil: ${response.status}`);
                        return response.json();
                    }),
            ]);

            const summary = {
                temp: null,
                humidity: null,
                uv: null,
                aqi: null,
                symbol: "",
                precipMm: null,
            };

            if (weatherResult.status === "fulfilled") {
                const currentSeries = weatherResult.value?.properties?.timeseries?.[0] || null;
                const details = currentSeries?.data?.instant?.details || {};
                summary.temp = Number.isFinite(details.air_temperature) ? details.air_temperature : null;
                summary.humidity = Number.isFinite(details.relative_humidity) ? details.relative_humidity : null;
                summary.uv = Number.isFinite(details.ultraviolet_index_clear_sky)
                    ? details.ultraviolet_index_clear_sky
                    : null;
                summary.symbol =
                    currentSeries?.data?.next_1_hours?.summary?.symbol_code
                    || currentSeries?.data?.next_6_hours?.summary?.symbol_code
                    || currentSeries?.data?.next_12_hours?.summary?.symbol_code
                    || "";

                const precipitation1h = currentSeries?.data?.next_1_hours?.details?.precipitation_amount;
                const precipitation6h = currentSeries?.data?.next_6_hours?.details?.precipitation_amount;
                const precipitation12h = currentSeries?.data?.next_12_hours?.details?.precipitation_amount;

                summary.precipMm = Number.isFinite(precipitation1h)
                    ? precipitation1h
                    : Number.isFinite(precipitation6h)
                        ? precipitation6h / 6
                        : Number.isFinite(precipitation12h)
                            ? precipitation12h / 12
                            : null;
            }

            if (aqiResult.status === "fulfilled") {
                const entries = aqiResult.value?.data?.time || [];
                const rawAqi = pickCurrentMetAqi(entries);
                summary.aqi = Number.isFinite(rawAqi)
                    ? rawAqi * OM_YR_AQI_SCALE_FACTOR
                    : null;
            }

            yrCurrentSummaryCache.set(cacheKey, {
                fetchedAt: Date.now(),
                value: summary,
            });

            return summary;
        })().finally(() => {
            yrCurrentSummaryPending.delete(cacheKey);
        });

        yrCurrentSummaryPending.set(cacheKey, pending);
        return pending;
    };

    const buildWeatherAlerts = ({ temp, humidity, uv, aqi }) => {
        const alerts = [];

        if (Number.isFinite(uv)) {
            if (uv >= 8) alerts.push({ tone: "danger", text: "Svært høy UV i dag" });
            else if (uv >= 6) alerts.push({ tone: "warn", text: "Høy UV i dag" });
        }

        if (Number.isFinite(aqi)) {
            if (aqi >= 100) alerts.push({ tone: "danger", text: "Dårlig luftkvalitet" });
            else if (aqi >= 50) alerts.push({ tone: "warn", text: "Moderat luftkvalitet" });
        }

        if (Number.isFinite(humidity)) {
            if (humidity >= 85) alerts.push({ tone: "warn", text: "Høy luftfuktighet" });
            else if (humidity <= 25) alerts.push({ tone: "warn", text: "Svært tørr luft" });
        }

        if (Number.isFinite(temp)) {
            if (temp <= -12) alerts.push({ tone: "danger", text: "Svært kald temperatur" });
            else if (temp <= -5) alerts.push({ tone: "warn", text: "Kald temperatur" });
            else if (temp >= 28) alerts.push({ tone: "warn", text: "Høy temperatur" });
        }

        return alerts;
    };

    const renderWeatherSummary = ({ temp, humidity, uv, aqi }) => {
        if (weatherSummaryChipsEl) {
            const chips = [
                { label: "Temperatur", icon: "thermometer", value: formatWeatherValue(temp, " °C", 1) },
                { label: "Fuktighet", icon: "droplets", value: formatWeatherValue(humidity, "%", 0) },
                { label: "UV", icon: "sun", value: formatWeatherValue(uv, "", 1) },
                { label: "AQI", icon: "wind", value: formatWeatherValue(aqi, "", 0) },
            ];

            weatherSummaryChipsEl.innerHTML = chips
                .map((chip) => `
                    <span class="weather-now-stat">
                        <span class="weather-now-stat__label"><i data-lucide="${chip.icon}" class="weather-now-stat__icon" aria-hidden="true"></i>${chip.label}:</span>
                        <span class="weather-now-stat__value">${chip.value}</span>
                    </span>
                `)
                .join("");

            applyLucideIcons();
        }

        if (!weatherAlertsEl) return;
        const alerts = buildWeatherAlerts({ temp, humidity, uv, aqi });

        if (!alerts.length) {
            weatherAlertsEl.innerHTML = "<span class=\"weather-alert weather-alert--ok\">Forholdene ser stabile ut.</span>";
            return;
        }

        weatherAlertsEl.innerHTML = alerts
            .map((alert) => `<span class="weather-alert weather-alert--${alert.tone}">${alert.text}</span>`)
            .join("");
    };

    const toOsloDayKey = (isoDate) => {
        const date = new Date(isoDate);
        if (Number.isNaN(date.getTime())) return "";
        return date.toLocaleDateString("sv-SE", { timeZone: OM_OSLO_TIMEZONE });
    };

    const toOsloHour = (isoDate) => {
        const date = new Date(isoDate);
        if (Number.isNaN(date.getTime())) return null;
        const hourText = date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            hourCycle: "h23",
            timeZone: OM_OSLO_TIMEZONE,
        });
        const hour = Number(hourText);
        return Number.isInteger(hour) ? hour : null;
    };

    const formatForecastUpdatedAt = (isoDate) => {
        if (!isoDate) return "";
        const date = new Date(isoDate);
        if (Number.isNaN(date.getTime())) return "";
        const datePart = date.toLocaleDateString("nb-NO", {
            day: "2-digit",
            month: "2-digit",
        });
        const timePart = date.toLocaleTimeString("nb-NO", {
            hour: "2-digit",
            minute: "2-digit",
        });
        return `Oppdatert ${datePart} kl. ${timePart}`;
    };

    const normalizeYrSymbolLabel = (symbolCode) => {
        const raw = String(symbolCode || "").trim().toLowerCase();
        if (!raw) return "Ukjent";
        const key = raw.replace(/_(day|night|polartwilight)$/g, "");

        const symbolLabels = [
            ["thunder", "Torden"],
            ["heavyrain", "Kraftig regn"],
            ["lightrain", "Lett regn"],
            ["rainshowers", "Regnbyger"],
            ["rain", "Regn"],
            ["heavysleet", "Kraftig sludd"],
            ["lightsleet", "Lett sludd"],
            ["sleet", "Sludd"],
            ["heavysnow", "Kraftig snø"],
            ["lightsnow", "Lett snø"],
            ["snowshowers", "Snøbyger"],
            ["snow", "Snø"],
            ["partlycloudy", "Delvis skyet"],
            ["clearsky", "Klar himmel"],
            ["fair", "Lettskyet"],
            ["cloudy", "Skyet"],
            ["fog", "Tåke"],
        ];

        const matched = symbolLabels.find(([token]) => key.includes(token));
        if (matched) return matched[1];

        return key
            .replace(/_/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    };

    const resolveWeatherSceneMode = (symbolCode) => {
        const key = String(symbolCode || "").toLowerCase();
        if (!key) return "cloudy";
        if (key.includes("thunder")) return "thunder";
        if (key.includes("snow")) return "snow";
        if (key.includes("rain") || key.includes("sleet")) return "rain";
        if (key.includes("partlycloudy")) return "partly";
        if (key.includes("clearsky") || key.includes("fair")) return "sunny";
        if (key.includes("fog") || key.includes("cloudy")) return "cloudy";
        return "cloudy";
    };

    const resolveWeatherScenePeriod = (symbolCode) => {
        const key = String(symbolCode || "").trim().toLowerCase();
        if (key.endsWith("_day")) return "day";
        if (key.endsWith("_night")) return "night";
        if (key.endsWith("_polartwilight")) return "twilight";

        const osloHour = toOsloHour(new Date().toISOString());
        if (!Number.isInteger(osloHour)) return "day";
        if (osloHour >= 8 && osloHour < 17) return "day";
        if ((osloHour >= 5 && osloHour < 8) || (osloHour >= 17 && osloHour < 22)) return "twilight";
        return "night";
    };

    const isRainLikeSymbol = (symbolCode) => {
        const key = String(symbolCode || "").toLowerCase();
        return key.includes("rain") || key.includes("sleet") || key.includes("thunder");
    };

    const setSceneRainLevel = (level = "none") => {
        if (!weatherNowSceneEl) return;
        weatherNowSceneEl.dataset.rainLevel = level;
    };

    const resolveRainLevel = (precipMm) => {
        if (!Number.isFinite(precipMm)) return "light";
        const mm = Math.max(precipMm, 0);
        if (mm <= 0.01) return "none";
        if (mm < 0.4) return "light";
        if (mm < 1.2) return "moderate";
        return "heavy";
    };

    const randomBetween = (min, max) => min + Math.random() * (max - min);

    const resolveRainProfile = (precipMm) => {
        const mm = Number.isFinite(precipMm) ? Math.max(precipMm, 0) : 0.35;
        if (mm < 0.05) {
            return {
                count: 8,
                durationMin: 1.45,
                durationMax: 2.05,
                widthMin: 1.0,
                widthMax: 1.5,
                heightMin: 7,
                heightMax: 10,
                opacityMin: 0.32,
                opacityMax: 0.5,
                driftMin: -3,
                driftMax: 3,
            };
        }
        if (mm < 0.4) {
            return {
                count: 14,
                durationMin: 1.2,
                durationMax: 1.75,
                widthMin: 1.1,
                widthMax: 1.7,
                heightMin: 8,
                heightMax: 12,
                opacityMin: 0.38,
                opacityMax: 0.6,
                driftMin: -4,
                driftMax: 4,
            };
        }
        if (mm < 1.2) {
            return {
                count: 22,
                durationMin: 1,
                durationMax: 1.45,
                widthMin: 1.2,
                widthMax: 2,
                heightMin: 9,
                heightMax: 14,
                opacityMin: 0.45,
                opacityMax: 0.7,
                driftMin: -5,
                driftMax: 5,
            };
        }
        if (mm < 3.5) {
            return {
                count: 34,
                durationMin: 0.82,
                durationMax: 1.2,
                widthMin: 1.4,
                widthMax: 2.3,
                heightMin: 11,
                heightMax: 16,
                opacityMin: 0.5,
                opacityMax: 0.78,
                driftMin: -6,
                driftMax: 6,
            };
        }
        return {
            count: 46,
            durationMin: 0.68,
            durationMax: 1.02,
            widthMin: 1.6,
            widthMax: 2.6,
            heightMin: 12,
            heightMax: 18,
            opacityMin: 0.55,
            opacityMax: 0.85,
            driftMin: -7,
            driftMax: 7,
        };
    };

    const renderRainDrops = ({ symbol = "", precipMm = null } = {}) => {
        if (!weatherNowRainLayerEl) return;

        if (!isRainLikeSymbol(symbol)) {
            weatherNowRainLayerEl.innerHTML = "";
            setSceneRainLevel("none");
            return;
        }

        const numericRain = Number.isFinite(precipMm) ? Math.max(precipMm, 0) : null;
        const rainLevel = resolveRainLevel(numericRain);
        setSceneRainLevel(rainLevel);

        if (rainLevel === "none") {
            weatherNowRainLayerEl.innerHTML = "";
            return;
        }

        const profile = resolveRainProfile(numericRain);
        const fragment = document.createDocumentFragment();
        const rainLayerHeight = weatherNowRainLayerEl.clientHeight || 140;
        const travelMin = Math.max(96, rainLayerHeight + 14);
        const travelMax = Math.max(travelMin + 24, rainLayerHeight + 72);

        for (let i = 0; i < profile.count; i += 1) {
            const drop = document.createElement("span");
            drop.className = "weather-drop";
            drop.style.left = `${randomBetween(2, 98).toFixed(2)}%`;
            drop.style.setProperty("--drop-width", `${randomBetween(profile.widthMin, profile.widthMax).toFixed(2)}px`);
            drop.style.setProperty("--drop-height", `${randomBetween(profile.heightMin, profile.heightMax).toFixed(2)}px`);
            drop.style.setProperty("--drop-opacity", randomBetween(profile.opacityMin, profile.opacityMax).toFixed(2));

            const duration = randomBetween(profile.durationMin, profile.durationMax);
            drop.style.setProperty("--drop-duration", `${duration.toFixed(2)}s`);
            drop.style.setProperty("--drop-delay", `${(-randomBetween(0, duration)).toFixed(2)}s`);
            drop.style.setProperty("--drop-drift", `${randomBetween(profile.driftMin, profile.driftMax).toFixed(2)}px`);
            drop.style.setProperty("--drop-start-y", `${randomBetween(-52, -18).toFixed(2)}px`);
            drop.style.setProperty("--drop-travel", `${randomBetween(travelMin, travelMax).toFixed(2)}px`);

            fragment.appendChild(drop);
        }

        weatherNowRainLayerEl.innerHTML = "";
        weatherNowRainLayerEl.appendChild(fragment);
    };

    const renderWeatherNow = ({ temp = null, symbol = "", precipMm = null } = {}) => {
        const sceneMode = resolveWeatherSceneMode(symbol);
        const scenePeriod = resolveWeatherScenePeriod(symbol);

        if (weatherNowTempEl) {
            weatherNowTempEl.textContent = Number.isFinite(temp)
                ? formatWeatherValue(temp, " °C", 1)
                : "- °C";
        }

        if (weatherNowConditionEl) {
            const label = normalizeYrSymbolLabel(symbol);
            const conditionText = label === "Ukjent"
                ? "Nåværende forhold"
                : label;

            if ((sceneMode === "rain" || sceneMode === "thunder") && Number.isFinite(precipMm)) {
                weatherNowConditionEl.textContent = `${conditionText} · ${formatWeatherValue(precipMm, " mm/t", 1)}`;
            } else {
                weatherNowConditionEl.textContent = conditionText;
            }
        }

        if (weatherNowSceneEl) {
            weatherNowSceneEl.dataset.mode = sceneMode;
            weatherNowSceneEl.dataset.period = scenePeriod;
        }

        renderRainDrops({ symbol, precipMm });
    };

    const yrSymbolToEmoji = (symbolCode) => {
        const key = String(symbolCode || "").toLowerCase();
        if (!key) return "🌡️";
        if (key.includes("thunder")) return "⛈️";
        if (key.includes("snow")) return "❄️";
        if (key.includes("sleet")) return "🌨️";
        if (key.includes("rain")) return "🌧️";
        if (key.includes("fog")) return "🌫️";
        if (key.includes("partlycloudy")) return "⛅";
        if (key.includes("cloudy")) return "☁️";
        if (key.includes("clearsky") || key.includes("fair")) return "☀️";
        return "🌡️";
    };

    const aggregateYrForecastDays = (timeseries = []) => {
        const byDay = new Map();

        timeseries.forEach((entry) => {
            const isoTime = entry?.time;
            const details = entry?.data?.instant?.details || {};
            if (!isoTime) return;

            const key = toOsloDayKey(isoTime);
            if (!key) return;

            const temperature = details.air_temperature;
            const windSpeed = details.wind_speed;
            const precipitation1h = entry?.data?.next_1_hours?.details?.precipitation_amount;
            const precipitation6h = entry?.data?.next_6_hours?.details?.precipitation_amount;
            const precipitation = Number.isFinite(precipitation1h)
                ? precipitation1h
                : Number.isFinite(precipitation6h)
                    ? precipitation6h / 6
                    : 0;

            const symbolCode =
                entry?.data?.next_1_hours?.summary?.symbol_code
                || entry?.data?.next_6_hours?.summary?.symbol_code
                || entry?.data?.next_12_hours?.summary?.symbol_code
                || "";

            if (!byDay.has(key)) {
                byDay.set(key, {
                    key,
                    min: Infinity,
                    max: -Infinity,
                    precip: 0,
                    windMax: null,
                    symbol: "",
                });
            }

            const day = byDay.get(key);

            if (Number.isFinite(temperature)) {
                if (temperature < day.min) day.min = temperature;
                if (temperature > day.max) day.max = temperature;
            }

            if (Number.isFinite(windSpeed)) {
                day.windMax = Number.isFinite(day.windMax)
                    ? Math.max(day.windMax, windSpeed)
                    : windSpeed;
            }

            day.precip += Number.isFinite(precipitation) ? precipitation : 0;

            const osloHour = toOsloHour(isoTime);
            if (!day.symbol || (Number.isInteger(osloHour) && osloHour >= 10 && osloHour <= 15)) {
                if (symbolCode) day.symbol = symbolCode;
            }
        });

        const todayKey = toOsloDayKey(new Date().toISOString());

        return Array.from(byDay.values())
            .filter((day) => day.key >= todayKey)
            .sort((a, b) => a.key.localeCompare(b.key))
            .slice(0, 7)
            .map((day) => ({
                key: day.key,
                min: Number.isFinite(day.min) ? day.min : null,
                max: Number.isFinite(day.max) ? day.max : null,
                precip: Number.isFinite(day.precip) ? day.precip : null,
                windMax: Number.isFinite(day.windMax) ? day.windMax : null,
                symbol: day.symbol || "",
            }));
    };

    const getYrForecastCacheKey = (lat, lon) => `${Number(lat).toFixed(3)},${Number(lon).toFixed(3)}`;

    const fetchYrForecastForCoords = async (lat, lon) => {
        const cacheKey = getYrForecastCacheKey(lat, lon);
        const now = Date.now();
        const cached = yrForecastCache.get(cacheKey);
        if (cached && now - cached.fetchedAt < OM_YR_CACHE_TTL_MS) {
            return cached.value;
        }

        if (yrForecastPending.has(cacheKey)) {
            return yrForecastPending.get(cacheKey);
        }

        const pending = (async () => {
            const url =
                "https://api.met.no/weatherapi/locationforecast/2.0/compact" +
                `?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;

            const response = await fetch(url, {
                headers: {
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Yr API-feil: ${response.status} ${response.statusText}`);
            }

            const payload = await response.json();
            const timeseries = Array.isArray(payload?.properties?.timeseries)
                ? payload.properties.timeseries
                : [];

            const value = {
                updatedAt: payload?.properties?.meta?.updated_at || null,
                days: aggregateYrForecastDays(timeseries),
            };

            yrForecastCache.set(cacheKey, {
                fetchedAt: Date.now(),
                value,
            });

            return value;
        })().finally(() => {
            yrForecastPending.delete(cacheKey);
        });

        yrForecastPending.set(cacheKey, pending);
        return pending;
    };

    const openMeteoCodeToSummary = (code) => {
        const numeric = Number(code);
        if (numeric === 0) return { symbol: "clearsky", icon: "☀️" };
        if (numeric === 1 || numeric === 2) return { symbol: "partlycloudy", icon: "⛅" };
        if (numeric === 3) return { symbol: "cloudy", icon: "☁️" };
        if (numeric === 45 || numeric === 48) return { symbol: "fog", icon: "🌫️" };
        if ((numeric >= 51 && numeric <= 67) || (numeric >= 80 && numeric <= 82)) return { symbol: "rain", icon: "🌧️" };
        if ((numeric >= 71 && numeric <= 77) || numeric === 85 || numeric === 86) return { symbol: "snow", icon: "❄️" };
        if (numeric >= 95) return { symbol: "thunder", icon: "⛈️" };
        return { symbol: "weather", icon: "🌡️" };
    };

    const fetchOpenMeteoForecastForCoords = async (lat, lon) => {
        const url =
            "https://api.open-meteo.com/v1/forecast" +
            `?latitude=${encodeURIComponent(lat)}` +
            `&longitude=${encodeURIComponent(lon)}` +
            "&daily=temperature_2m_min,temperature_2m_max,precipitation_sum,wind_speed_10m_max,weather_code" +
            "&forecast_days=7" +
            "&timezone=Europe%2FOslo";

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Open-Meteo forecast-feil: ${response.status} ${response.statusText}`);
        }

        const payload = await response.json();
        const daily = payload?.daily || {};
        const days = Array.isArray(daily.time) ? daily.time : [];
        const min = Array.isArray(daily.temperature_2m_min) ? daily.temperature_2m_min : [];
        const max = Array.isArray(daily.temperature_2m_max) ? daily.temperature_2m_max : [];
        const precip = Array.isArray(daily.precipitation_sum) ? daily.precipitation_sum : [];
        const wind = Array.isArray(daily.wind_speed_10m_max) ? daily.wind_speed_10m_max : [];
        const weatherCodes = Array.isArray(daily.weather_code) ? daily.weather_code : [];

        return {
            updatedAt: new Date().toISOString(),
            days: days.slice(0, 7).map((day, idx) => {
                const summary = openMeteoCodeToSummary(weatherCodes[idx]);
                return {
                    key: day,
                    min: Number.isFinite(min[idx]) ? min[idx] : null,
                    max: Number.isFinite(max[idx]) ? max[idx] : null,
                    precip: Number.isFinite(precip[idx]) ? precip[idx] : null,
                    windMax: Number.isFinite(wind[idx]) ? wind[idx] : null,
                    symbol: summary.symbol,
                    icon: summary.icon,
                };
            }),
        };
    };

    const renderWeatherForecast = ({ updatedAt, days, sourceLabel = "Yr" }) => {
        if (!weatherForecastGridEl || !weatherForecastStatusEl) return;

        if (weatherForecastUpdatedEl) {
            const updatedText = formatForecastUpdatedAt(updatedAt);
            weatherForecastUpdatedEl.textContent = updatedText
                ? `${sourceLabel} · ${updatedText}`
                : `Kilde: ${sourceLabel}`;
        }

        if (!Array.isArray(days) || !days.length) {
            weatherForecastGridEl.innerHTML = "";
            weatherForecastStatusEl.textContent = "Fant ikke varsel for valgt sted akkurat nå.";
            return;
        }

        const dayNameFormatter = new Intl.DateTimeFormat("nb-NO", { weekday: "short", timeZone: OM_OSLO_TIMEZONE });
        const dayDateFormatter = new Intl.DateTimeFormat("nb-NO", { day: "2-digit", month: "2-digit", timeZone: OM_OSLO_TIMEZONE });

        weatherForecastGridEl.innerHTML = days
            .map((day) => {
                const date = new Date(`${day.key}T12:00:00`);
                const dayName = dayNameFormatter.format(date);
                const dateLabel = dayDateFormatter.format(date);
                const symbolText = normalizeYrSymbolLabel(day.symbol);
                const icon = day.icon || yrSymbolToEmoji(day.symbol);

                return `
                    <article class="weather-day" aria-label="${dayName} ${dateLabel}">
                        <div class="weather-day__top">
                            <span class="weather-day__name">${dayName} ${dateLabel}</span>
                            <span class="weather-day__icon" aria-hidden="true">${icon}</span>
                        </div>
                        <div class="weather-day__temp">${formatWeatherValue(day.min, " °C", 0)} / ${formatWeatherValue(day.max, " °C", 0)}</div>
                        <div class="weather-day__meta">Nedbør: ${formatWeatherValue(day.precip, " mm", 1)}</div>
                        <div class="weather-day__meta">Vind: ${formatWeatherValue(day.windMax, " m/s", 1)}</div>
                        <div class="weather-day__symbol">${symbolText}</div>
                    </article>
                `;
            })
            .join("");

        weatherForecastStatusEl.textContent = "";
    };

    const updateWeatherForecast = async (lat, lon) => {
        if (!weatherForecastStatusEl || !weatherForecastGridEl) return;
        weatherForecastStatusEl.textContent = "Henter Yr-varsel...";

        try {
            const forecast = await fetchYrForecastForCoords(lat, lon);
            renderWeatherForecast({ ...forecast, sourceLabel: "Yr" });
        } catch (error) {
            console.error(error);

            try {
                const fallback = await fetchOpenMeteoForecastForCoords(lat, lon);
                renderWeatherForecast({ ...fallback, sourceLabel: "Open-Meteo" });
                weatherForecastStatusEl.textContent = "Yr utilgjengelig nå. Viser Open-Meteo-varsel.";
            } catch (fallbackError) {
                console.error(fallbackError);
                weatherForecastGridEl.innerHTML = "";
                weatherForecastStatusEl.textContent = "Kunne ikke hente værvarsel akkurat nå.";
                if (weatherForecastUpdatedEl) weatherForecastUpdatedEl.textContent = "";
            }
        }
    };

    const handleRangeSelectorKeyboard = (event, buttons, onSelect) => {
        if (!Array.isArray(buttons) || buttons.length < 2) return;
        const key = event.key;
        const navKeys = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"];
        if (!navKeys.includes(key)) return;

        event.preventDefault();
        const activeElement = document.activeElement;
        const focusedIndex = buttons.findIndex((btn) => btn === activeElement);
        const currentIndex = focusedIndex >= 0
            ? focusedIndex
            : buttons.findIndex((btn) => btn.classList.contains("is-active"));
        let nextIndex = currentIndex >= 0 ? currentIndex : 0;

        if (key === "ArrowRight" || key === "ArrowDown") {
            nextIndex = (nextIndex + 1) % buttons.length;
        } else if (key === "ArrowLeft" || key === "ArrowUp") {
            nextIndex = (nextIndex - 1 + buttons.length) % buttons.length;
        } else if (key === "Home") {
            nextIndex = 0;
        } else if (key === "End") {
            nextIndex = buttons.length - 1;
        }

        const nextButton = buttons[nextIndex];
        if (!nextButton) return;
        nextButton.focus();
        onSelect(nextButton);
    };

    let omSelectedRange = "ytd";
    let omPrevToggleState = null;
    let omPrevSeries = null;
    let omPrevSeriesKey = null;
    let omPrevGradientAllowed = null;
    let omLastRenderedTrendState = null;
    let omLastRenderedTrendSizeKey = "";
    let omTrendRerenderQueued = false;

    const getTrendCanvasSizeKey = () => {
        const canvas = document.getElementById("trendChart");
        if (!canvas) return "";

        const rect = canvas.getBoundingClientRect();
        const width = Math.round(rect.width || 0);
        const height = Math.round(rect.height || 0);
        if (width < 10 || height < 10) return "";

        const dpr = Math.round((window.devicePixelRatio || 1) * 100) / 100;
        return `${width}x${height}@${dpr}`;
    };

    const renderTrendChartState = (state, overrides = {}) => {
        if (!state) return;

        replaceAndDrawTrendChart(state.labels, state.tempValues, {
            humidityPoints: state.humidityValues,
            uvPoints: state.uvValues,
            aqiPoints: state.aqiValues,
            humidityActive: state.humidityActive,
            uvActive: state.uvActive,
            aqiActive: state.aqiActive,
            gradientAllowed: state.gradientAllowed,
            animateGradient: false,
            animateTemp: false,
            animateHumidity: false,
            animateUv: false,
            animateAqi: false,
            ...overrides,
        });
    };

    const markTrendChartRendered = (state) => {
        omLastRenderedTrendState = state;
        const sizeKey = getTrendCanvasSizeKey();
        if (sizeKey) {
            omLastRenderedTrendSizeKey = sizeKey;
        }
    };

    const scheduleTrendChartRerenderIfNeeded = () => {
        if (omTrendRerenderQueued) return;
        omTrendRerenderQueued = true;

        window.requestAnimationFrame(() => {
            omTrendRerenderQueued = false;
            if (!omLastRenderedTrendState) return;

            const currentSizeKey = getTrendCanvasSizeKey();
            if (!currentSizeKey) return;
            if (currentSizeKey === omLastRenderedTrendSizeKey) return;

            renderTrendChartState(omLastRenderedTrendState);
            omLastRenderedTrendSizeKey = getTrendCanvasSizeKey() || currentSizeKey;
        });
    };

    const positionRangeIndicator = () => {
        if (!omRangeSelector || !omRangeIndicator) return;
        const activeBtn = omRangeSelector.querySelector(".range-selector__btn.is-active");
        if (!activeBtn) return;
        const buttonRect = activeBtn.getBoundingClientRect();
        const containerRect = omRangeSelector.getBoundingClientRect();
        const offsetX = buttonRect.left - containerRect.left;
        const inset = 10;
        const indicatorWidth = Math.max(24, buttonRect.width - inset);
        omRangeIndicator.style.width = `${indicatorWidth}px`;
        omRangeIndicator.style.transform = `translateX(${offsetX + inset / 2}px)`;
    };

    const setActiveRange = (nextRange) => {
        if (!nextRange || omSelectedRange === nextRange) return;
        omSelectedRange = nextRange;
        omRangeButtons.forEach((btn) => {
            const isActive = btn.dataset.range === nextRange;
            btn.classList.toggle("is-active", isActive);
            btn.setAttribute("aria-selected", isActive ? "true" : "false");
        });
        positionRangeIndicator();
    };

    async function updateTrendChartForCoords(lat, lon, options = {}) {
        const showWeatherNowLoader = options.showWeatherNowLoader === true;
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
            setOmStatus("Skriv inn gyldige koordinater.");
            setTrendChartLoading(false);
            return;
        }
        if (showWeatherNowLoader) {
            setWeatherNowLocationLoading(true);
        }
        setTrendChartLoading(true);
        void updateWeatherForecast(lat, lon);
        try {
            setOmStatus("Henter grafdata…");
            const { labels, values, humidity, days } = await fetchTemperaturesForRange(lat, lon, omSelectedRange);
            const yearToDateExtremesPromise = getYearToDateExtremesForLocation(lat, lon);
            const yrCurrentSummaryPromise = fetchYrCurrentSummaryForCoords(lat, lon);
            const includeTemp = omTempToggle ? omTempToggle.checked : true;
            const includeHumidity = !!omHumidityToggle?.checked;
            const includeUv = !!omUvToggle?.checked;
            const includeAqi = !!omAqiToggle?.checked;
            const disableGradient = includeUv || includeAqi;
            const gradientAllowed = !disableGradient;
            const animateGradient = omPrevGradientAllowed !== null && omPrevGradientAllowed !== gradientAllowed;

            const fetchKey = `${lat},${lon},${omSelectedRange}`;
            const canAnimateOut = !!omPrevSeries && omPrevSeriesKey === fetchKey;

            const nextToggleState = {
                temp: includeTemp,
                humidity: includeHumidity,
                uv: includeUv,
                aqi: includeAqi,
            };

            const animateTemp = includeTemp && (!omPrevToggleState || !omPrevToggleState.temp);
            const animateHumidity = includeHumidity && (!omPrevToggleState || !omPrevToggleState.humidity);
            const animateUv = includeUv && (!omPrevToggleState || !omPrevToggleState.uv);
            const animateAqi = includeAqi && (!omPrevToggleState || !omPrevToggleState.aqi);

            const tempOff = !!omPrevToggleState?.temp && !includeTemp;
            const humidityOff = !!omPrevToggleState?.humidity && !includeHumidity;
            const uvOff = !!omPrevToggleState?.uv && !includeUv;
            const aqiOff = !!omPrevToggleState?.aqi && !includeAqi;

            const extraRequests = [
                includeUv ? fetchUvIndexForRange(lat, lon, omSelectedRange, days) : Promise.resolve(null),
                includeAqi ? fetchAqiForRange(lat, lon, omSelectedRange, days) : Promise.resolve(null),
                yearToDateExtremesPromise,
                yrCurrentSummaryPromise,
            ];
            const [uvResult, aqiResult, yearToDateExtremesResult, yrCurrentSummaryResult] = await Promise.allSettled(extraRequests);
            const warnings = [];

            const yearToDateStats =
                yearToDateExtremesResult.status === "fulfilled" ? yearToDateExtremesResult.value : null;
            setOmUvUpdatedAtStatus(yearToDateStats);

            const uvRawValues = uvResult.status === "fulfilled" ? uvResult.value : null;
            const uvValues = hasNonZeroSeries(uvRawValues) ? uvRawValues : null;
            if (uvResult.status === "rejected" || !uvValues) warnings.push("UV");

            const aqiRawValues = aqiResult.status === "fulfilled" ? aqiResult.value : null;
            const aqiValues = hasNonZeroSeries(aqiRawValues) ? aqiRawValues : null;
            if (aqiResult.status === "rejected" || !aqiValues) warnings.push("AQI");

            const yrCurrentSummary = yrCurrentSummaryResult.status === "fulfilled"
                ? yrCurrentSummaryResult.value
                : null;

            const tempValues = includeTemp ? values : values.map(() => null);
            const finalTrendState = {
                labels,
                tempValues,
                humidityValues: includeHumidity ? humidity : null,
                uvValues: includeUv ? uvValues : null,
                aqiValues: includeAqi ? aqiValues : null,
                humidityActive: includeHumidity,
                uvActive: includeUv,
                aqiActive: includeAqi,
                gradientAllowed,
            };

            const exitLabels = canAnimateOut && (tempOff || humidityOff || uvOff || aqiOff)
                ? omPrevSeries?.labels || labels
                : labels;
            const exitTemp = includeTemp
                ? values
                : tempOff && canAnimateOut
                    ? omPrevSeries?.tempValues || null
                    : null;
            const exitHumidity = includeHumidity
                ? humidity
                : humidityOff && canAnimateOut
                    ? omPrevSeries?.humidityValues || null
                    : null;
            const exitUv = includeUv
                ? uvValues
                : uvOff && canAnimateOut
                    ? omPrevSeries?.uvValues || null
                    : null;
            const exitAqi = includeAqi
                ? aqiValues
                : aqiOff && canAnimateOut
                    ? omPrevSeries?.aqiValues || null
                    : null;

            const runExitAnimation = canAnimateOut && (tempOff || humidityOff || uvOff || aqiOff);

            const finalDraw = () => {
                renderTrendChartState(finalTrendState);
                markTrendChartRendered(finalTrendState);
            };

            replaceAndDrawTrendChart(exitLabels, exitTemp || tempValues, {
                humidityPoints: exitHumidity,
                uvPoints: exitUv,
                aqiPoints: exitAqi,
                humidityActive: includeHumidity || humidityOff,
                uvActive: includeUv || uvOff,
                aqiActive: includeAqi || aqiOff,
                gradientAllowed,
                animateGradient,
                animateTemp,
                animateHumidity,
                animateUv,
                animateAqi,
                animateOutTemp: runExitAnimation && tempOff,
                animateOutHumidity: runExitAnimation && humidityOff,
                animateOutUv: runExitAnimation && uvOff,
                animateOutAqi: runExitAnimation && aqiOff,
                onComplete: runExitAnimation ? finalDraw : null,
            });
            if (!runExitAnimation) {
                markTrendChartRendered(finalTrendState);
            }

            omPrevToggleState = nextToggleState;
            omPrevSeries = {
                labels,
                tempValues: values,
                humidityValues: humidity,
                uvValues,
                aqiValues,
            };
            omPrevSeriesKey = fetchKey;
            omPrevGradientAllowed = gradientAllowed;

            const nowSummary = {
                temp: Number.isFinite(yrCurrentSummary?.temp) ? yrCurrentSummary.temp : null,
                humidity: Number.isFinite(yrCurrentSummary?.humidity) ? yrCurrentSummary.humidity : null,
                uv: Number.isFinite(yrCurrentSummary?.uv) ? yrCurrentSummary.uv : null,
                aqi: Number.isFinite(yrCurrentSummary?.aqi) ? yrCurrentSummary.aqi : null,
                symbol: yrCurrentSummary?.symbol || "",
                precipMm: Number.isFinite(yrCurrentSummary?.precipMm) ? yrCurrentSummary.precipMm : null,
            };

            renderWeatherSummary(nowSummary);
            renderWeatherNow(nowSummary);

            if (warnings.length) {
                setOmStatus(`Delvis feil: ${warnings.join(", ")} utilgjengelig.`);
            } else {
                setOmStatus("");
            }
        } catch (err) {
            console.error(err);
            const emptySummary = createEmptyWeatherSummary();
            renderWeatherSummary(emptySummary);
            renderWeatherNow(emptySummary);
            setOmStatus(`Feil: ${err.message}`);
        } finally {
            setTrendChartLoading(false);
            if (showWeatherNowLoader) {
                setWeatherNowLocationLoading(false);
            }
        }
    }

    const omLatInput = document.getElementById("omLat");
    const omLonInput = document.getElementById("omLon");
    const geocodingSearchInput = document.getElementById("geocodingSearch");
    const omLocationResults = document.getElementById("omLocationResults");
    const weatherNowSearchInput = document.getElementById("weatherNowSearch");
    const weatherNowLocationResults = document.getElementById("weatherNowLocationResults");
    const omTempToggle = document.getElementById("omTempToggle");
    const omHumidityToggle = document.getElementById("omHumidityToggle");
    const omUvToggle = document.getElementById("omUvToggle");
    const omAqiToggle = document.getElementById("omAqiToggle");
    const DEFAULT_LAT = 59.9139;
    const DEFAULT_LON = 10.7522;
    const OM_GEOCODING_ENDPOINT = "https://geocoding-api.open-meteo.com/v1/search";

    if (omHumidityToggle) omHumidityToggle.checked = true;
    if (omUvToggle) omUvToggle.checked = true;
    if (omAqiToggle) omAqiToggle.checked = true;

    if (omLatInput && omLonInput) {
        const searchField = geocodingSearchInput?.closest(".field-with-icon--city") || null;
        const weatherNowSearchField = weatherNowSearchInput?.closest(".field-with-icon--city") || null;
        let omLocationSearchTimer = null;
        let weatherNowSearchTimer = null;
        let omLocationResultsData = [];
        let weatherNowLocationResultsData = [];
        let omLocationActiveIndex = -1;
        let weatherNowLocationActiveIndex = -1;

        const closeLocationOverlay = () => {
            if (!omLocationResults || !geocodingSearchInput) return;
            omLocationResults.hidden = true;
            geocodingSearchInput.setAttribute("aria-expanded", "false");
            omLocationActiveIndex = -1;
        };

        const closeWeatherNowOverlay = () => {
            if (!weatherNowLocationResults || !weatherNowSearchInput) return;
            weatherNowLocationResults.hidden = true;
            weatherNowSearchInput.setAttribute("aria-expanded", "false");
            weatherNowLocationActiveIndex = -1;
        };

        const closeAllLocationOverlays = () => {
            closeLocationOverlay();
            closeWeatherNowOverlay();
        };

        const formatLocationLabel = (entry) => {
            const parts = [entry.name, entry.admin1, entry.country].filter(Boolean);
            return parts.join(", ");
        };

        const applySelectedLocation = ({ lat, lon, label }) => {
            if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
            const nextLabel = String(label || "").trim();
            omLatInput.value = lat.toFixed(4);
            omLonInput.value = lon.toFixed(4);

            if (geocodingSearchInput && nextLabel) {
                geocodingSearchInput.value = nextLabel;
            }

            if (weatherNowSearchInput) {
                weatherNowSearchInput.value = nextLabel || geocodingSearchInput?.value || "";
            }

            setWeatherLocationLabel({
                label: nextLabel || geocodingSearchInput?.value || weatherNowSearchInput?.value,
                lat,
                lon,
            });

            closeAllLocationOverlays();
            updateTrendChartForCoords(lat, lon, { showWeatherNowLoader: true });
        };

        const setActiveLocationResult = (nextIndex) => {
            if (!omLocationResults) return;
            const nodes = Array.from(omLocationResults.querySelectorAll(".weather-location-results__item"));
            nodes.forEach((node, idx) => {
                const isActive = idx === nextIndex;
                node.classList.toggle("is-active", isActive);
                node.setAttribute("aria-selected", isActive ? "true" : "false");
            });
            omLocationActiveIndex = nextIndex;
        };

        const setActiveWeatherNowResult = (nextIndex) => {
            if (!weatherNowLocationResults) return;
            const nodes = Array.from(weatherNowLocationResults.querySelectorAll(".weather-location-results__item"));
            nodes.forEach((node, idx) => {
                const isActive = idx === nextIndex;
                node.classList.toggle("is-active", isActive);
                node.setAttribute("aria-selected", isActive ? "true" : "false");
            });
            weatherNowLocationActiveIndex = nextIndex;
        };

        const renderLocationResults = (results = []) => {
            if (!omLocationResults || !geocodingSearchInput) return;
            omLocationResults.innerHTML = "";
            omLocationResultsData = results;

            if (!results.length) {
                closeLocationOverlay();
                return;
            }

            results.forEach((entry, index) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "weather-location-results__item";
                button.setAttribute("role", "option");
                button.setAttribute("aria-selected", "false");

                const name = document.createElement("span");
                name.className = "weather-location-results__name";
                name.textContent = entry.name || "Ukjent sted";

                const meta = document.createElement("span");
                meta.className = "weather-location-results__meta";
                meta.textContent = [entry.admin1, entry.country].filter(Boolean).join(", ");

                button.append(name, meta);
                button.addEventListener("click", () => {
                    if (!Number.isFinite(Number(entry.latitude)) || !Number.isFinite(Number(entry.longitude))) return;
                    applySelectedLocation({
                        lat: Number(entry.latitude),
                        lon: Number(entry.longitude),
                        label: formatLocationLabel(entry),
                    });
                });
                button.addEventListener("mouseenter", () => setActiveLocationResult(index));
                omLocationResults.appendChild(button);
            });

            omLocationResults.hidden = false;
            geocodingSearchInput.setAttribute("aria-expanded", "true");
            setActiveLocationResult(-1);
        };

        const renderWeatherNowLocationResults = (results = []) => {
            if (!weatherNowLocationResults || !weatherNowSearchInput) return;
            weatherNowLocationResults.innerHTML = "";
            weatherNowLocationResultsData = results;

            if (!results.length) {
                closeWeatherNowOverlay();
                return;
            }

            results.forEach((entry, index) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "weather-location-results__item";
                button.setAttribute("role", "option");
                button.setAttribute("aria-selected", "false");

                const name = document.createElement("span");
                name.className = "weather-location-results__name";
                name.textContent = entry.name || "Ukjent sted";

                const meta = document.createElement("span");
                meta.className = "weather-location-results__meta";
                meta.textContent = [entry.admin1, entry.country].filter(Boolean).join(", ");

                button.append(name, meta);
                button.addEventListener("click", () => {
                    if (!Number.isFinite(Number(entry.latitude)) || !Number.isFinite(Number(entry.longitude))) return;
                    applySelectedLocation({
                        lat: Number(entry.latitude),
                        lon: Number(entry.longitude),
                        label: formatLocationLabel(entry),
                    });
                });
                button.addEventListener("mouseenter", () => setActiveWeatherNowResult(index));
                weatherNowLocationResults.appendChild(button);
            });

            weatherNowLocationResults.hidden = false;
            weatherNowSearchInput.setAttribute("aria-expanded", "true");
            setActiveWeatherNowResult(-1);
        };

        const fetchLocationResults = async (queryText) => {
            const query = (queryText || "").trim();
            if (query.length < 2) {
                setOmStatus("");
                return [];
            }

            const params = new URLSearchParams({
                name: query,
                count: "8",
                language: "no",
                format: "json",
            });

            try {
                const response = await fetch(`${OM_GEOCODING_ENDPOINT}?${params.toString()}`);
                if (!response.ok) {
                    throw new Error("Kunne ikke hente stedsforslag");
                }
                const data = await response.json();
                const results = Array.isArray(data?.results) ? data.results : [];
                if (!results.length) setOmStatus("Ingen treff på sted.");
                else setOmStatus("");
                return results;
            } catch (error) {
                console.error(error);
                setOmStatus("Klarte ikke hente stedsforslag.");
                return [];
            }
        };

        if (omRangeButtons.length) {
            omRangeButtons.forEach((btn) => {
                btn.addEventListener("click", () => {
                    const nextRange = btn.dataset.range;
                    setActiveRange(nextRange);
                    updateTrendChartForCoords(Number(omLatInput.value), Number(omLonInput.value));
                });
            });

            if (omRangeSelector) {
                omRangeSelector.addEventListener("keydown", (event) => {
                    handleRangeSelectorKeyboard(event, omRangeButtons, (btn) => {
                        const nextRange = btn.dataset.range;
                        setActiveRange(nextRange);
                        updateTrendChartForCoords(Number(omLatInput.value), Number(omLonInput.value));
                    });
                });
            }

            requestAnimationFrame(positionRangeIndicator);
            window.addEventListener("resize", positionRangeIndicator);
        }

        if (!omLatInput.value) omLatInput.value = DEFAULT_LAT;
        if (!omLonInput.value) omLonInput.value = DEFAULT_LON;
        if (geocodingSearchInput && !geocodingSearchInput.value.trim()) {
            geocodingSearchInput.value = "Oslo, Norge";
        }
        if (weatherNowSearchInput && !weatherNowSearchInput.value.trim()) {
            weatherNowSearchInput.value = geocodingSearchInput?.value?.trim() || "Oslo, Norge";
        }

        setWeatherLocationLabel({
            label: weatherNowSearchInput?.value || geocodingSearchInput?.value,
            lat: Number(omLatInput.value),
            lon: Number(omLonInput.value),
        });

        let omInputTimer = null;
        const scheduleOmUpdate = () => {
            if (omInputTimer) clearTimeout(omInputTimer);
            omInputTimer = setTimeout(() => {
                const lat = Number(omLatInput.value);
                const lon = Number(omLonInput.value);
                closeAllLocationOverlays();

                const explicitLabel = geocodingSearchInput?.value?.trim() || weatherNowSearchInput?.value?.trim() || "";
                setWeatherLocationLabel({ label: explicitLabel, lat, lon });

                if (weatherNowSearchInput && geocodingSearchInput?.value?.trim()) {
                    weatherNowSearchInput.value = geocodingSearchInput.value;
                }

                updateTrendChartForCoords(lat, lon, { showWeatherNowLoader: true });
            }, 400);
        };

        const handleCoordPaste = (event) => {
            const text = event.clipboardData?.getData("text")?.trim();
            if (!text) return;
            const matches = text.match(/-?\d+(?:[.,]\d+)?/g);
            if (!matches || matches.length < 2) return;
            const lat = Number(matches[0].replace(",", "."));
            const lon = Number(matches[1].replace(",", "."));
            if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
            event.preventDefault();
            omLatInput.value = lat;
            omLonInput.value = lon;
            const coordLabel = formatLocationFromCoords(lat, lon);
            if (geocodingSearchInput) geocodingSearchInput.value = coordLabel;
            if (weatherNowSearchInput) weatherNowSearchInput.value = coordLabel;
            setWeatherLocationLabel({ label: coordLabel, lat, lon });
            closeAllLocationOverlays();
            updateTrendChartForCoords(lat, lon, { showWeatherNowLoader: true });
        };

        if (geocodingSearchInput) {
            geocodingSearchInput.addEventListener("input", () => {
                if (omLocationSearchTimer) clearTimeout(omLocationSearchTimer);
                omLocationSearchTimer = setTimeout(async () => {
                    const results = await fetchLocationResults(geocodingSearchInput.value);
                    renderLocationResults(results);
                }, 250);
            });

            geocodingSearchInput.addEventListener("focus", () => {
                if (omLocationResultsData.length) {
                    omLocationResults.hidden = false;
                    geocodingSearchInput.setAttribute("aria-expanded", "true");
                }
            });

            geocodingSearchInput.addEventListener("keydown", (event) => {
                if (omLocationResults?.hidden || !omLocationResultsData.length) return;
                if (event.key === "ArrowDown") {
                    event.preventDefault();
                    const next = Math.min(omLocationActiveIndex + 1, omLocationResultsData.length - 1);
                    setActiveLocationResult(next);
                    return;
                }
                if (event.key === "ArrowUp") {
                    event.preventDefault();
                    const next = Math.max(omLocationActiveIndex - 1, 0);
                    setActiveLocationResult(next);
                    return;
                }
                if (event.key === "Enter" && omLocationActiveIndex >= 0) {
                    event.preventDefault();
                    const entry = omLocationResultsData[omLocationActiveIndex];
                    if (!entry) return;
                    applySelectedLocation({
                        lat: Number(entry.latitude),
                        lon: Number(entry.longitude),
                        label: formatLocationLabel(entry),
                    });
                    return;
                }
                if (event.key === "Escape") {
                    closeLocationOverlay();
                }
            });
        }

        if (weatherNowSearchInput) {
            weatherNowSearchInput.addEventListener("input", () => {
                if (weatherNowSearchTimer) clearTimeout(weatherNowSearchTimer);
                weatherNowSearchTimer = setTimeout(async () => {
                    const results = await fetchLocationResults(weatherNowSearchInput.value);
                    renderWeatherNowLocationResults(results);
                }, 250);
            });

            weatherNowSearchInput.addEventListener("focus", () => {
                if (weatherNowLocationResultsData.length && weatherNowLocationResults) {
                    weatherNowLocationResults.hidden = false;
                    weatherNowSearchInput.setAttribute("aria-expanded", "true");
                }
            });

            weatherNowSearchInput.addEventListener("keydown", (event) => {
                if (weatherNowLocationResults?.hidden || !weatherNowLocationResultsData.length) return;
                if (event.key === "ArrowDown") {
                    event.preventDefault();
                    const next = Math.min(weatherNowLocationActiveIndex + 1, weatherNowLocationResultsData.length - 1);
                    setActiveWeatherNowResult(next);
                    return;
                }
                if (event.key === "ArrowUp") {
                    event.preventDefault();
                    const next = Math.max(weatherNowLocationActiveIndex - 1, 0);
                    setActiveWeatherNowResult(next);
                    return;
                }
                if (event.key === "Enter" && weatherNowLocationActiveIndex >= 0) {
                    event.preventDefault();
                    const entry = weatherNowLocationResultsData[weatherNowLocationActiveIndex];
                    if (!entry) return;
                    applySelectedLocation({
                        lat: Number(entry.latitude),
                        lon: Number(entry.longitude),
                        label: formatLocationLabel(entry),
                    });
                    return;
                }
                if (event.key === "Escape") {
                    closeWeatherNowOverlay();
                }
            });
        }

        document.addEventListener("click", (event) => {
            if (searchField && !searchField.contains(event.target)) {
                closeLocationOverlay();
            }
            if (weatherNowSearchField && !weatherNowSearchField.contains(event.target)) {
                closeWeatherNowOverlay();
            }
        });

        omLatInput.addEventListener("input", scheduleOmUpdate);
        omLonInput.addEventListener("input", scheduleOmUpdate);
        omLatInput.addEventListener("change", scheduleOmUpdate);
        omLonInput.addEventListener("change", scheduleOmUpdate);
        omLatInput.addEventListener("paste", handleCoordPaste);
        omLonInput.addEventListener("paste", handleCoordPaste);
        [omTempToggle, omHumidityToggle, omUvToggle, omAqiToggle].forEach((toggle) => {
            if (!toggle) return;
            toggle.addEventListener("change", () => {
                updateTrendChartForCoords(Number(omLatInput.value), Number(omLonInput.value));
            });
        });

        updateTrendChartForCoords(Number(omLatInput.value), Number(omLonInput.value));
    }

    //aksjer og krypto (gratis)
    function replaceAndDrawMarketChart(labels, points, options = {}) {
        const current = document.getElementById("marketChart");
        if (!current || !current.parentNode) return;
        const fresh = current.cloneNode(true);
        current.parentNode.replaceChild(fresh, current);
        drawTemperatureLineChart(fresh, labels, points, options);
    }

    const COINGECKO_BASE = "https://api.coingecko.com/api/v3";
    const marketTypeSelect = document.getElementById("marketType");
    const marketSymbolInput = document.getElementById("marketSymbol");
    const marketBaseInput = document.getElementById("marketBase");
    const marketQuoteInput = document.getElementById("marketQuote");
    const marketStatusEl = document.getElementById("marketStatus");
    const marketRangeSelector = document.getElementById("marketRangeSelector");
    const marketRangeButtons = marketRangeSelector
        ? Array.from(marketRangeSelector.querySelectorAll("[data-range]"))
        : [];
    const marketRangeIndicator = marketRangeSelector
        ? marketRangeSelector.querySelector(".range-selector__indicator")
        : null;
    const marketChartTile = document.getElementById("marketChartTile");
    const marketFields = Array.from(document.querySelectorAll("[data-market-field]"));
    const DEFAULT_STOCK_SYMBOL = "AAPL";
    let marketSelectedRange = "30d";
    let marketAutoFetchTimer = null;

    const setMarketStatus = (msg, tone = "info") => {
        if (!marketStatusEl) return;
        marketStatusEl.textContent = msg;
        marketStatusEl.classList.toggle("is-error", tone === "error" && Boolean(msg));
    };

    const setMarketChartLoading = (isLoading) => {
        if (!marketChartTile) return;
        marketChartTile.classList.toggle("is-loading", Boolean(isLoading));
    };

    const setMarketChartInvalid = (message = "Ugyldig symbol/ISIN") => {
        if (!marketChartTile) return;
        marketChartTile.classList.add("is-invalid");
        marketChartTile.dataset.invalidMessage = message;
    };

    const clearMarketChartInvalid = () => {
        if (!marketChartTile) return;
        marketChartTile.classList.remove("is-invalid");
        delete marketChartTile.dataset.invalidMessage;
    };

    const normalizeUpper = (value) => (value || "").trim().toUpperCase();
    const normalizeLower = (value) => (value || "").trim().toLowerCase();

    const stockInputAliases = {
        eqnr: "EQNR.OL",
        nhy: "NHY.OL",
        yara: "YAR.OL",
        dnb: "DNB.OL",
        akrbp: "AKRBP.OL",
    };

    const coinGeckoIds = {
        btc: "bitcoin",
        eth: "ethereum",
        sol: "solana",
        xrp: "ripple",
        ada: "cardano",
        doge: "dogecoin",
        bnb: "binancecoin",
        link: "chainlink",
        dot: "polkadot",
        ltc: "litecoin",
    };

    const toggleMarketFields = () => {
        const type = marketTypeSelect?.value || "stock";
        marketFields.forEach((field) => {
            const show = field.dataset.marketField === type;
            field.classList.toggle("is-hidden", !show);
        });
    };

    const positionMarketRangeIndicator = () => {
        if (!marketRangeSelector || !marketRangeIndicator) return;
        const activeBtn = marketRangeSelector.querySelector(".range-selector__btn.is-active");
        if (!activeBtn) return;
        const buttonRect = activeBtn.getBoundingClientRect();
        const containerRect = marketRangeSelector.getBoundingClientRect();
        const offsetX = buttonRect.left - containerRect.left;
        const inset = 10;
        const indicatorWidth = Math.max(24, buttonRect.width - inset);
        marketRangeIndicator.style.width = `${indicatorWidth}px`;
        marketRangeIndicator.style.transform = `translateX(${offsetX + inset / 2}px)`;
    };

    const setMarketRange = (nextRange) => {
        if (!nextRange || marketSelectedRange === nextRange) return;
        marketSelectedRange = nextRange;
        marketRangeButtons.forEach((btn) => {
            const isActive = btn.dataset.range === nextRange;
            btn.classList.toggle("is-active", isActive);
            btn.setAttribute("aria-selected", isActive ? "true" : "false");
        });
        positionMarketRangeIndicator();
    };

    const parseStooqCsv = (csvText, rangeKey) => {
        const lines = csvText.trim().split(/\r?\n/);
        if (lines.length < 2) return { labels: [], values: [] };
        const { start, end } = getRangeForKey(rangeKey);
        const labels = [];
        const values = [];
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            const parts = line.includes(";") ? line.split(";") : line.split(",");
            const dateStr = parts[0];
            const closeStr = parts[4];
            if (!dateStr || !datePattern.test(dateStr) || !closeStr) continue;
            const date = new Date(`${dateStr}T00:00:00Z`);
            if (!Number.isFinite(date.getTime())) continue;
            if (date < start || date > end) continue;
            const closeVal = Number.parseFloat(closeStr);
            labels.push(dayFormatter.format(date));
            values.push(Number.isFinite(closeVal) ? closeVal : null);
        }

        return { labels, values };
    };

    const extractCsvSegment = (text) => {
        const raw = String(text || "").trim();
        if (!raw) return "";
        const lines = raw
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean);
        if (!lines.length) return "";

        const csvHeaderIndex = lines.findIndex((line) => /^date[,;]/i.test(line));
        if (csvHeaderIndex >= 0) {
            return lines.slice(csvHeaderIndex).join("\n");
        }

        const firstDataRow = lines.findIndex((line) => /^\d{4}-\d{2}-\d{2}[,;]/.test(line));
        if (firstDataRow >= 0) {
            return ["Date,Open,High,Low,Close,Volume", ...lines.slice(firstDataRow)].join("\n");
        }

        return "";
    };

    const extractJsonObject = (text) => {
        const raw = String(text || "");
        const startIndex = raw.indexOf("{");
        const endIndex = raw.lastIndexOf("}");
        if (startIndex < 0 || endIndex <= startIndex) return null;

        const jsonSlice = raw.slice(startIndex, endIndex + 1);
        try {
            return JSON.parse(jsonSlice);
        } catch {
            return null;
        }
    };

    const getYahooRange = (rangeKey) => {
        if (rangeKey === "1y") return "1y";
        if (rangeKey === "5y") return "5y";
        if (rangeKey === "ytd") return "ytd";
        return "1mo";
    };

    const normalizeStockInput = (rawSymbol) => {
        const compact = normalizeUpper(rawSymbol).replace(/\s+/g, "");
        if (!compact) return "";
        const alias = stockInputAliases[normalizeLower(compact)];
        return alias || compact;
    };

    const buildStockCandidates = (rawSymbol) => {
        const normalized = normalizeStockInput(rawSymbol);
        if (!normalized) return [];

        const candidates = [];
        const seen = new Set();
        const addCandidate = (display, yahoo, stooq) => {
            const key = `${display}|${yahoo}|${stooq}`;
            if (!display || !yahoo || !stooq || seen.has(key)) return;
            seen.add(key);
            candidates.push({ display, yahoo, stooq });
        };

        if (normalized.includes(".")) {
            const [baseRaw, suffixRaw = ""] = normalized.split(".");
            const base = normalizeUpper(baseRaw);
            const suffix = normalizeUpper(suffixRaw);
            const yahooSymbol = suffix === "US" ? base : `${base}.${suffix}`;
            const stooqSymbol = `${normalizeLower(base)}.${normalizeLower(suffix)}`;
            addCandidate(normalized, yahooSymbol, stooqSymbol);
            if (suffix === "US") {
                addCandidate(base, base, `${normalizeLower(base)}.us`);
            }
        } else {
            const base = normalized;
            addCandidate(base, base, `${normalizeLower(base)}.us`);
            addCandidate(`${base}.OL`, `${base}.OL`, `${normalizeLower(base)}.ol`);
        }

        return candidates;
    };

    async function fetchYahooHistory(symbol, rangeKey) {
        const cleanSymbol = normalizeUpper(symbol);
        const range = getYahooRange(rangeKey);
        const queryPath =
            `/v8/finance/chart/${encodeURIComponent(cleanSymbol)}` +
            `?range=${encodeURIComponent(range)}&interval=1d`;
        const directUrl = `https://query1.finance.yahoo.com${queryPath}`;

        const proxyUrls = [
            `https://r.jina.ai/http://query1.finance.yahoo.com${queryPath}`,
            `https://r.jina.ai/http://query2.finance.yahoo.com${queryPath}`,
            `https://api.allorigins.win/raw?url=${encodeURIComponent(directUrl)}`,
        ];

        let lastError = null;
        for (const proxyUrl of proxyUrls) {
            try {
                const responseText = await fetchWithTimeout(proxyUrl, 9000);
                const json = extractJsonObject(responseText);
                if (!json) {
                    lastError = new Error("Yahoo-proxy returnerte ugyldig JSON.");
                    continue;
                }

                const apiError = json?.chart?.error;
                if (apiError) {
                    lastError = new Error(apiError.description || "Yahoo Finance fant ikke symbolet.");
                    continue;
                }

                const result = json?.chart?.result?.[0];
                const timestamps = Array.isArray(result?.timestamp) ? result.timestamp : [];
                const closes = Array.isArray(result?.indicators?.quote?.[0]?.close)
                    ? result.indicators.quote[0].close
                    : [];

                if (!timestamps.length || !closes.length) {
                    lastError = new Error("Yahoo Finance returnerte ingen historikk.");
                    continue;
                }

                const { start, end } = getRangeForKey(rangeKey);
                const labels = [];
                const values = [];

                for (let i = 0; i < timestamps.length; i++) {
                    const ts = Number(timestamps[i]);
                    const close = Number(closes[i]);
                    if (!Number.isFinite(ts) || !Number.isFinite(close)) continue;

                    const date = new Date(ts * 1000);
                    if (!Number.isFinite(date.getTime())) continue;
                    if (date < start || date > end) continue;

                    labels.push(dayFormatter.format(date));
                    values.push(close);
                }

                if (!labels.length) {
                    lastError = new Error("Yahoo Finance ga ingen datapunkter i valgt periode.");
                    continue;
                }

                return { labels, values, source: "Yahoo Finance" };
            } catch (err) {
                lastError = err;
            }
        }

        throw lastError || new Error("Yahoo Finance er utilgjengelig akkurat nå.");
    }

    async function fetchStooqHistory(symbol, rangeKey) {
        const cleanSymbol = normalizeLower(symbol);
        const dataUrl = `https://stooq.com/q/d/l/?s=${encodeURIComponent(cleanSymbol)}&i=d`;
        const proxyUrls = [
            `https://api.allorigins.win/raw?url=${encodeURIComponent(dataUrl)}`,
            `https://cors.isomorphic-git.org/${dataUrl}`,
            `https://r.jina.ai/http://stooq.com/q/d/l/?s=${encodeURIComponent(cleanSymbol)}&i=d`,
            `https://r.jina.ai/http://www.stooq.com/q/d/l/?s=${encodeURIComponent(cleanSymbol)}&i=d`,
        ];

        let lastError = null;
        for (const proxyUrl of proxyUrls) {
            try {
                const rawText = await fetchWithTimeout(proxyUrl, 9000);
                const csvText = extractCsvSegment(rawText);
                if (!csvText) {
                    lastError = new Error("Stooq-proxy svarte uten CSV-data.");
                    continue;
                }
                const parsed = parseStooqCsv(csvText, rangeKey);
                if (parsed.labels.length) {
                    return { ...parsed, source: "Stooq" };
                }
                lastError = new Error("Stooq returnerte ingen data i valgt periode.");
            } catch (err) {
                lastError = err;
            }
        }

        throw lastError || new Error("Fant ingen data hos Stooq.");
    }

    async function fetchStockHistory(rawSymbol, rangeKey) {
        const candidates = buildStockCandidates(rawSymbol);
        if (!candidates.length) {
            throw new Error("Skriv inn ticker (f.eks. AAPL eller EQNR.OL).");
        }

        let lastError = null;
        for (const candidate of candidates) {
            try {
                const yahoo = await fetchYahooHistory(candidate.yahoo, rangeKey);
                return { ...yahoo, resolvedSymbol: candidate.display };
            } catch (yahooErr) {
                lastError = yahooErr;
            }

            try {
                const stooq = await fetchStooqHistory(candidate.stooq, rangeKey);
                return { ...stooq, resolvedSymbol: candidate.display };
            } catch (stooqErr) {
                lastError = stooqErr;
            }
        }

        const lastMessage = String(lastError?.message || "");
        const sourceIssue = /fetch|timeout|proxy|http\s*\d+|utilgjengelig/i.test(lastMessage);
        if (sourceIssue) {
            throw new Error("Kunne ikke hente fra gratis datakilder akkurat nå. Prøv igjen senere.");
        }

        const normalized = normalizeStockInput(rawSymbol);
        const hint = normalized && !normalized.includes(".")
            ? `Prøv ${normalized} eller ${normalized}.OL.`
            : "Sjekk ticker-formatet (f.eks. AAPL, AAPL.US eller EQNR.OL).";
        throw new Error(`Fant ingen data for symbolet. ${hint}`);
    }

    const isIsin = (value) => /^NO\d{10}$/i.test((value || "").trim());

    const filterByRange = (rows, rangeKey) => {
        const { start, end } = getRangeForKey(rangeKey);
        return rows.filter((row) => row.date >= start && row.date <= end);
    };

    async function fetchFundHistoryByIsin(isin, rangeKey) {
        const cleanIsin = normalizeUpper(isin);
        const resolveUrl = `/.netlify/functions/resolve-symbol?isin=${encodeURIComponent(cleanIsin)}`;
        const legacyResolveUrl = `/api/resolve-symbol?isin=${encodeURIComponent(cleanIsin)}`;

        let symbol = "";
        let resolved = null;
        try {
            resolved = await fetch(resolveUrl);
        } catch {
            resolved = null;
        }
        if (!resolved || !resolved.ok) {
            resolved = await fetch(legacyResolveUrl);
        }
        if (!resolved.ok) {
            throw new Error(`Symbol-oppslag feilet (HTTP ${resolved.status})`);
        }
        const resolvedData = await resolved.json();
        symbol = normalizeUpper(resolvedData?.symbol || "");
        if (!symbol) {
            throw new Error("Fant ikke symbol for ISIN.");
        }

        const historyUrl = `/.netlify/functions/historical-quotes?symbol=${encodeURIComponent(symbol)}`;
        const legacyHistoryUrl = `/api/historical-quotes?symbol=${encodeURIComponent(symbol)}`;

        let historyRes = null;
        try {
            historyRes = await fetch(historyUrl);
        } catch {
            historyRes = null;
        }
        if (!historyRes || !historyRes.ok) {
            historyRes = await fetch(legacyHistoryUrl);
        }
        if (!historyRes.ok) {
            throw new Error(`Historikk feilet (HTTP ${historyRes.status})`);
        }

        const historyJson = await historyRes.json();
        const rawRows = Array.isArray(historyJson)
            ? historyJson
            : (historyJson.data || historyJson.results || historyJson.quotes || []);

        const normalizedRows = rawRows
            .map((row) => {
                const dateValue = row.date || row.datetime || row.day || null;
                const tsValue = row.timestamp ? Number(row.timestamp) : null;

                let date = null;
                if (dateValue) {
                    date = new Date(String(dateValue).slice(0, 10));
                } else if (Number.isFinite(tsValue)) {
                    date = new Date(tsValue * 1000);
                }
                if (!date || !Number.isFinite(date.getTime())) return null;

                const close = Number(row.c ?? row.close ?? row.price ?? row.nav);
                if (!Number.isFinite(close)) return null;

                return { date, close };
            })
            .filter(Boolean)
            .sort((a, b) => a.date - b.date);

        const filteredRows = filterByRange(normalizedRows, rangeKey);
        if (!filteredRows.length) {
            throw new Error("Fant ingen fondsdata i valgt periode.");
        }

        return {
            labels: filteredRows.map((row) => dayFormatter.format(row.date)),
            values: filteredRows.map((row) => row.close),
            symbol,
        };
    }

    const getCoinGeckoDays = (rangeKey) => {
        if (rangeKey === "1y") return 365;
        if (rangeKey === "5y") return 365 * 5;
        if (rangeKey === "ytd") {
            const today = new Date();
            const start = new Date(today.getFullYear(), 0, 1);
            const diffMs = today - start;
            return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        }
        return 30;
    };

    async function fetchCoinGeckoHistory(baseAsset, quoteAsset, rangeKey) {
        const base = normalizeLower(baseAsset);
        const quote = normalizeLower(quoteAsset);
        const coinId = coinGeckoIds[base] || base;
        const days = getCoinGeckoDays(rangeKey);
        const url =
            `${COINGECKO_BASE}/coins/${encodeURIComponent(coinId)}/market_chart` +
            `?vs_currency=${encodeURIComponent(quote)}` +
            `&days=${encodeURIComponent(days)}` +
            `&interval=daily`;

        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`CoinGecko feil: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        const prices = Array.isArray(data?.prices) ? data.prices : [];
        const labels = prices.map((entry) => dayFormatter.format(new Date(entry[0])));
        const values = prices.map((entry) => (Number.isFinite(entry[1]) ? entry[1] : null));
        if (!labels.length) {
            throw new Error("Fant ingen data (sjekk coin ID).");
        }
        return { labels, values, coinId };
    }

    async function updateMarketChart() {
        const type = marketTypeSelect?.value || "stock";
        setMarketChartLoading(true);
        clearMarketChartInvalid();
        setMarketStatus("Henter markedsdata…");

        try {
            if (type === "stock") {
                const rawSymbol = (marketSymbolInput?.value || "").trim();
                if (!rawSymbol) {
                    setMarketStatus("Skriv inn ticker (f.eks. AAPL eller EQNR.OL).", "error");
                    setMarketChartInvalid("Mangler ticker");
                    return;
                }

                let labels = [];
                let values = [];
                let chartLabel = normalizeStockInput(rawSymbol);

                if (isIsin(rawSymbol)) {
                    try {
                        const fundResult = await fetchFundHistoryByIsin(rawSymbol, marketSelectedRange);
                        labels = fundResult.labels;
                        values = fundResult.values;
                        chartLabel = fundResult.symbol || chartLabel;
                    } catch (err) {
                        console.error(err);
                        setMarketStatus(
                            "ISIN-oppslag krever backend (f.eks. Netlify Functions). På GitHub Pages: bruk ticker som AAPL eller EQNR.OL.",
                            "error"
                        );
                        setMarketChartInvalid("ISIN krever backend");
                        return;
                    }
                } else {
                    const stockResult = await fetchStockHistory(rawSymbol, marketSelectedRange);
                    labels = stockResult.labels;
                    values = stockResult.values;
                    chartLabel = stockResult.resolvedSymbol || chartLabel;
                    setMarketStatus(`Viser ${chartLabel} fra ${stockResult.source}.`);
                }

                replaceAndDrawMarketChart(labels, values, {
                    primaryLabel: `${chartLabel} pris`,
                    primarySuffix: "",
                    primaryFormatter: new Intl.NumberFormat("no-NO", { maximumFractionDigits: 2 }),
                });
                clearMarketChartInvalid();
                if (isIsin(rawSymbol)) {
                    setMarketStatus(`Viser ${chartLabel}.`);
                }
            } else {
                const baseAsset = normalizeUpper(marketBaseInput?.value);
                const quoteAsset = normalizeUpper(marketQuoteInput?.value);
                if (!baseAsset || !quoteAsset) {
                    setMarketStatus("Skriv inn basis og motvaluta.", "error");
                    return;
                }
                const { labels, values } = await fetchCoinGeckoHistory(baseAsset, quoteAsset, marketSelectedRange);
                replaceAndDrawMarketChart(labels, values, {
                    primaryLabel: `${baseAsset}/${quoteAsset}`,
                    primarySuffix: "",
                    primaryFormatter: new Intl.NumberFormat("no-NO", { maximumFractionDigits: 6 }),
                });
                clearMarketChartInvalid();
                setMarketStatus(`Viser ${baseAsset}/${quoteAsset} fra CoinGecko.`);
            }
        } catch (err) {
            console.error(err);
            if (type === "stock") {
                const errorMessage = String(err?.message || "");
                const sourceIssue = /gratis datakilder|fetch|timeout|proxy|http\s*\d+|utilgjengelig/i.test(errorMessage);
                setMarketChartInvalid(sourceIssue ? "Datakilde utilgjengelig" : "Ingen data for symbolet");
            }
            setMarketStatus(`Feil: ${err.message}`, "error");
        } finally {
            setMarketChartLoading(false);
        }
    }

    const scheduleMarketAutoFetch = () => {
        clearTimeout(marketAutoFetchTimer);
        marketAutoFetchTimer = setTimeout(updateMarketChart, 450);
    };

    if (marketTypeSelect) {
        if (marketTypeSelect.value === "stock" && marketSymbolInput && !marketSymbolInput.value.trim()) {
            marketSymbolInput.value = DEFAULT_STOCK_SYMBOL;
        }
        toggleMarketFields();
        marketTypeSelect.addEventListener("change", () => {
            toggleMarketFields();
            scheduleMarketAutoFetch();
        });
    }

    if (marketRangeButtons.length) {
        marketRangeButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const nextRange = btn.dataset.range;
                setMarketRange(nextRange);
                updateMarketChart();
            });
        });

        if (marketRangeSelector) {
            marketRangeSelector.addEventListener("keydown", (event) => {
                handleRangeSelectorKeyboard(event, marketRangeButtons, (btn) => {
                    const nextRange = btn.dataset.range;
                    setMarketRange(nextRange);
                    updateMarketChart();
                });
            });
        }

        requestAnimationFrame(positionMarketRangeIndicator);
        window.addEventListener("resize", positionMarketRangeIndicator);
    }

    if (marketSymbolInput) {
        marketSymbolInput.addEventListener("input", scheduleMarketAutoFetch);
        marketSymbolInput.addEventListener("change", scheduleMarketAutoFetch);
    }

    if (marketBaseInput) {
        marketBaseInput.addEventListener("input", scheduleMarketAutoFetch);
        marketBaseInput.addEventListener("change", scheduleMarketAutoFetch);
    }

    if (marketQuoteInput) {
        marketQuoteInput.addEventListener("input", scheduleMarketAutoFetch);
        marketQuoteInput.addEventListener("change", scheduleMarketAutoFetch);
    }

    if (marketTypeSelect || marketRangeButtons.length || marketSymbolInput || marketBaseInput || marketQuoteInput) {
        updateMarketChart();
    }


    document.addEventListener("open-meteo:forecast", (evt) => {
        const { lat, lon } = evt?.detail || {};
        updateTrendChartForCoords(Number(lat), Number(lon), { showWeatherNowLoader: true });
    });

    //nedtelling-widget
    const countdownDisplay = document.getElementById("countdownDisplay");
    const countdownStatus = document.getElementById("countdownStatus");
    const countdownMinutesInput = document.getElementById("countdownMinutes");
    const countdownTargetTimeInput = document.getElementById("countdownTargetTime");
    const startMinutesBtn = document.getElementById("startMinutesBtn");
    const startTimeBtn = document.getElementById("startTimeBtn");
    const pauseCountdownBtn = document.getElementById("pauseCountdownBtn");
    const resetCountdownBtn = document.getElementById("resetCountdownBtn");
    const quickButtons = Array.from(document.querySelectorAll("#klokke [data-quick-minutes]"));

    if (countdownDisplay) {
        let countdownSeconds = 600;
        let countdownInterval = null;
        let targetTimestamp = null;

        const formatTid = (totalSekunder) => {
            const safeSeconds = Math.max(0, Math.floor(totalSekunder));
            const timer = String(Math.floor(safeSeconds / 3600)).padStart(2, "0");
            const min = String(Math.floor((safeSeconds % 3600) / 60)).padStart(2, "0");
            const sek = String(safeSeconds % 60).padStart(2, "0");
            return `${timer}:${min}:${sek}`;
        };

        const setStatus = (message) => {
            if (countdownStatus) countdownStatus.textContent = message;
        };

        const updateDisplay = () => {
            countdownDisplay.textContent = formatTid(countdownSeconds);
        };

        const stopCountdown = () => {
            if (countdownInterval) clearInterval(countdownInterval);
            countdownInterval = null;
        };

        const finishCountdown = () => {
            stopCountdown();
            countdownSeconds = 0;
            targetTimestamp = null;
            updateDisplay();
            setStatus("Ferdig! Tiden er ute.");
        };

        const tick = () => {
            if (targetTimestamp) {
                countdownSeconds = Math.ceil((targetTimestamp - Date.now()) / 1000);
            } else {
                countdownSeconds -= 1;
            }

            if (countdownSeconds <= 0) {
                finishCountdown();
                return;
            }

            updateDisplay();
        };

        const startCountdown = (seconds, statusMessage, nextTargetTimestamp = null) => {
            if (!Number.isFinite(seconds) || seconds <= 0) {
                setStatus("Velg en gyldig tid over 0.");
                return;
            }
            stopCountdown();
            targetTimestamp = nextTargetTimestamp;
            countdownSeconds = Math.floor(seconds);
            updateDisplay();
            setStatus(statusMessage);
            countdownInterval = setInterval(tick, 1000);
        };

        const startFromMinutes = (minutesValue) => {
            const minutes = Number.isFinite(minutesValue) ? minutesValue : parseFloat(countdownMinutesInput?.value || "");
            const validMinutes = Number.isFinite(minutes) && minutes > 0 ? minutes : 10;
            if (countdownMinutesInput) countdownMinutesInput.value = String(validMinutes);
            startCountdown(validMinutes * 60, `Kjører nedtelling: ${validMinutes} min.`);
        };

        const startToClockTime = () => {
            const timeValue = countdownTargetTimeInput?.value;
            if (!timeValue) {
                setStatus("Velg et klokkeslett først.");
                return;
            }

            const [hours, minutes] = timeValue.split(":").map(Number);
            if (!Number.isInteger(hours) || !Number.isInteger(minutes)) {
                setStatus("Ugyldig klokkeslett.");
                return;
            }

            const now = new Date();
            const target = new Date(now);
            target.setHours(hours, minutes, 0, 0);
            if (target <= now) {
                target.setDate(target.getDate() + 1);
            }

            const seconds = Math.ceil((target.getTime() - now.getTime()) / 1000);
            startCountdown(seconds, `Kjører nedtelling til ${timeValue}.`, target.getTime());
        };

        if (startMinutesBtn) startMinutesBtn.addEventListener("click", () => startFromMinutes());
        if (startTimeBtn) startTimeBtn.addEventListener("click", startToClockTime);

        if (pauseCountdownBtn) {
            pauseCountdownBtn.addEventListener("click", () => {
                stopCountdown();
                targetTimestamp = null;
                setStatus("Stoppet.");
            });
        }

        if (resetCountdownBtn) {
            resetCountdownBtn.addEventListener("click", () => {
                stopCountdown();
                targetTimestamp = null;
                countdownSeconds = 600;
                updateDisplay();
                setStatus("Nullstilt til 10:00.");
            });
        }

        quickButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const minutes = Number(button.dataset.quickMinutes);
                startFromMinutes(minutes);
            });
        });

        updateDisplay();
    }
        //Værinnhold håndteres av weatherCard-modulen over (Open-Meteo + Yr).

        //vis/skjul bokser fra sidebar + kategori-ruting
        const routePageTitleEl = document.getElementById("routePageTitle");
        const routePageDescriptionEl = document.getElementById("routePageDescription");
        const cardToggleHintEl = document.querySelector("[data-card-toggle-hint]");
        const routeLinks = Array.from(document.querySelectorAll("[data-route-link]"));
        const cardToggles = Array.from(document.querySelectorAll("[data-toggle-card]"));
        const grid = document.querySelector("main");
        const allCards = Array.from(document.querySelectorAll("main .bordershadow[id]"));
        const allCardIds = allCards.map((card) => card.id).filter(Boolean);

        const routeOrder = ["dashboard", "converters", "calculators", "all-tools"];
        const routeConfig = {
            dashboard: {
                slug: "dashboard",
                label: "Dashboard",
                description: "Informasjonsside med vær, klokke, nyheter, historiske hendelser og nyttige widgets.",
                cardIds: [
                    "datetimeCard",
                    "weatherNowCard",
                    "weatherCard",
                    "quote",
                    "timezoneCard",
                    "nrkNewsCard",
                    "historicalCard",
                    "holidayCard",
                    "enturCard",
                    "marketCard",
                    "klokke",
                ],
            },
            converters: {
                slug: "converters",
                label: "Converters",
                description: "Alle verktøy som konverterer innhold, enheter eller formater samlet på ett sted.",
                cardIds: [
                    "textCleanerCard",
                    "markdownConverterCard",
                    "unitConverterCard",
                    "currencyCard",
                    "colorWidget",
                ],
            },
            calculators: {
                slug: "calculators",
                label: "Kalkulatorer",
                description: "Klassiske og avanserte kalkulatorer, inkludert dato- og tidsberegninger.",
                cardIds: [
                    "calculatorCard",
                    "percentCard",
                    "proteinCard",
                    "salaryCard",
                    "ageCard",
                    "dateDiffCard",
                    "timeDiffCard",
                ],
            },
            "all-tools": {
                slug: "all-tools",
                label: "Alle verktøy",
                description: "Klassisk alt-på-ett-oppsett med alle paneler tilgjengelig på samme side.",
                cardIds: [],
            },
        };

        routeConfig["all-tools"].cardIds = allCardIds;

        const normalizeRouteKey = (value) => {
            const lower = String(value || "").trim().toLowerCase();
            if (lower === "alltools") return "all-tools";
            if (Object.prototype.hasOwnProperty.call(routeConfig, lower)) return lower;
            return "dashboard";
        };

        const normalizePath = (pathValue) => {
            const value = String(pathValue || "/");
            if (value === "/") return "/";
            const withoutTrailing = value.replace(/\/+$/, "");
            return withoutTrailing || "/";
        };

        const deriveAppBasePath = () => {
            const normalizedPath = normalizePath(window.location.pathname);
            const segments = normalizedPath.split("/").filter(Boolean);
            if (!segments.length) return "";

            const lastSegment = String(segments[segments.length - 1] || "").toLowerCase();
            if (routeOrder.includes(lastSegment) || lastSegment === "index.html") {
                segments.pop();
            }

            if (!segments.length) return "";
            return `/${segments.join("/")}`;
        };

        const appBasePath = deriveAppBasePath();

        const buildRoutePath = (routeKey) => {
            const key = normalizeRouteKey(routeKey);
            const slug = routeConfig[key].slug;
            const rawPath = `${appBasePath}/${slug}`.replace(/\/{2,}/g, "/");
            return normalizePath(rawPath);
        };

        const resolveRouteFromPath = (pathname) => {
            const normalizedPath = normalizePath(pathname);
            const segments = normalizedPath.split("/").filter(Boolean);
            if (!segments.length) return "dashboard";

            const lastSegment = String(segments[segments.length - 1] || "").toLowerCase();
            if (lastSegment === "index.html") return "dashboard";
            if (Object.prototype.hasOwnProperty.call(routeConfig, lastSegment)) return lastSegment;
            return "dashboard";
        };

        const updateRouteLinkHrefs = () => {
            routeLinks.forEach((link) => {
                const routeKey = normalizeRouteKey(link.dataset.routeLink);
                link.setAttribute("href", buildRoutePath(routeKey));
            });
        };

        const updateRouteLinkState = (routeKey) => {
            routeLinks.forEach((link) => {
                const linkRouteKey = normalizeRouteKey(link.dataset.routeLink);
                const isActive = linkRouteKey === routeKey;
                link.classList.toggle("is-active", isActive);
                if (isActive) {
                    link.setAttribute("aria-current", "page");
                } else {
                    link.removeAttribute("aria-current");
                }
            });
        };

        const updateRouteSummary = (routeKey) => {
            const route = routeConfig[routeKey];
            if (!route) return;
            if (routePageTitleEl) routePageTitleEl.textContent = route.label;
            if (routePageDescriptionEl) routePageDescriptionEl.textContent = route.description;
            document.body.dataset.activeRoute = routeKey;
        };

        let storedVisibility = {};
        try {
            const rawVisibility = localStorage.getItem("altkalkis-card-visibility");
            const parsedVisibility = rawVisibility ? JSON.parse(rawVisibility) : {};
            if (parsedVisibility && typeof parsedVisibility === "object") {
                storedVisibility = parsedVisibility;
            }
        } catch {
            storedVisibility = {};
        }

        const getStoredCardVisibility = (cardId) => {
            if (!Object.prototype.hasOwnProperty.call(storedVisibility, cardId)) return true;
            return Boolean(storedVisibility[cardId]);
        };

        const updateSidebarCategoryVisibility = () => {
            const categoryRows = Array.from(document.querySelectorAll(".sidebar__category"));
            categoryRows.forEach((category) => {
                let sibling = category.nextElementSibling;
                let hasVisibleToggle = false;

                while (sibling && !sibling.classList.contains("sidebar__category")) {
                    if (sibling.classList.contains("sidebar__toggle") && !sibling.classList.contains("is-hidden")) {
                        hasVisibleToggle = true;
                        break;
                    }
                    sibling = sibling.nextElementSibling;
                }

                category.classList.toggle("is-hidden", !hasVisibleToggle);
            });
        };

        const syncCardVisibilityForRoute = (routeKey) => {
            const allowedCards = new Set(routeConfig[routeKey]?.cardIds || []);
            const isAllTools = routeKey === "all-tools";

            allCardIds.forEach((cardId) => {
                const card = document.getElementById(cardId);
                if (!card) return;

                const routeAllowsCard = allowedCards.has(cardId);
                const userAllowsCard = getStoredCardVisibility(cardId);
                const shouldShowCard = routeAllowsCard && userAllowsCard;
                card.classList.toggle("is-hidden", !shouldShowCard);
            });

            cardToggles.forEach((toggle) => {
                const cardId = toggle.dataset.toggleCard;
                if (!cardId) return;

                const toggleRow = toggle.closest(".sidebar__toggle");
                const showToggle = isAllTools || allowedCards.has(cardId);
                if (toggleRow) toggleRow.classList.toggle("is-hidden", !showToggle);
                toggle.disabled = !showToggle;
            });

            updateSidebarCategoryVisibility();

            if (cardToggleHintEl) {
                const label = routeConfig[routeKey]?.label || "valgt kategori";
                cardToggleHintEl.textContent = isAllTools
                    ? "Vis/skjul paneler i klassisk alt-på-ett-visning."
                    : `Vis/skjul paneler i ${label}.`;
            }
        };

        let requestMasonryLayout = null;
        let routeAnimationTimer = null;
        let masonryBurstTimers = [];
        const clearMasonryBurstTimers = () => {
            masonryBurstTimers.forEach((timerId) => clearTimeout(timerId));
            masonryBurstTimers = [];
        };
        const requestMasonryLayoutBurst = () => {
            if (typeof requestMasonryLayout !== "function") return;
            clearMasonryBurstTimers();
            requestMasonryLayout(true);
            masonryBurstTimers.push(setTimeout(() => requestMasonryLayout(), 140));
            masonryBurstTimers.push(setTimeout(() => requestMasonryLayout(), 320));
        };

        const mobileCollapsibleCardIds = [...allCardIds];
        const mobileCardTitleById = {};
        cardToggles.forEach((toggle) => {
            const cardId = toggle.dataset.toggleCard;
            if (!cardId) return;
            const labelText = toggle.closest(".sidebar__toggle")?.querySelector("span")?.textContent?.trim();
            if (labelText) mobileCardTitleById[cardId] = labelText;
        });
        const mobileCollapseQuery = window.matchMedia("(max-width: 760px)");
        const mobileCollapseStorageKey = "altkalkis-mobile-card-collapse-all-v1";
        let mobileCollapseState = {};

        try {
            const rawMobileCollapseState = localStorage.getItem(mobileCollapseStorageKey);
            const parsedMobileCollapseState = rawMobileCollapseState ? JSON.parse(rawMobileCollapseState) : {};
            if (parsedMobileCollapseState && typeof parsedMobileCollapseState === "object") {
                mobileCollapseState = parsedMobileCollapseState;
            }
        } catch {
            mobileCollapseState = {};
        }

        const persistMobileCollapseState = () => {
            try {
                localStorage.setItem(mobileCollapseStorageKey, JSON.stringify(mobileCollapseState));
            } catch {
                // Ignorer lagringsfeil i private vinduer eller ved blokkert storage.
            }
        };

        const getMobileCollapseValue = (cardId) => {
            if (Object.prototype.hasOwnProperty.call(mobileCollapseState, cardId)) {
                return Boolean(mobileCollapseState[cardId]);
            }
            return true;
        };

        const setMobileCardCollapsedState = (card, toggleButton, collapsed) => {
            const title = card.querySelector("h2")?.textContent?.trim() || "panel";
            card.classList.toggle("is-mobile-collapsed", collapsed);
            toggleButton.setAttribute("aria-expanded", collapsed ? "false" : "true");
            toggleButton.setAttribute("aria-label", collapsed ? `Åpne ${title}` : `Lukk ${title}`);
            toggleButton.setAttribute("title", collapsed ? `Åpne ${title}` : `Lukk ${title}`);
        };

        const initializeMobileCollapsibleCard = (cardId) => {
            const card = document.getElementById(cardId);
            if (!card || card.dataset.mobileCollapseReady === "true") return;

            let title = Array.from(card.children).find((child) => child.tagName === "H2");
            if (!title) {
                const nestedTitle = card.querySelector("h2")?.textContent?.trim();
                title = document.createElement("h2");
                title.className = "mobile-generated-title";
                title.textContent = nestedTitle || mobileCardTitleById[cardId] || cardId;
                card.insertAdjacentElement("afterbegin", title);
                card.classList.add("has-mobile-generated-title");
            }

            card.classList.add("mobile-collapsible-card");
            const toggleButton = document.createElement("button");
            toggleButton.type = "button";
            toggleButton.className = "mobile-card-collapse-toggle";
            if (card.querySelector(".info-dot--card")) {
                toggleButton.classList.add("mobile-card-collapse-toggle--offset");
            }
            toggleButton.innerHTML = '<span class="mobile-card-collapse-toggle__icon" aria-hidden="true">▾</span>';
            title.insertAdjacentElement("afterend", toggleButton);

            setMobileCardCollapsedState(card, toggleButton, mobileCollapseQuery.matches && getMobileCollapseValue(cardId));

            toggleButton.addEventListener("click", () => {
                if (!mobileCollapseQuery.matches) return;

                const nextCollapsed = !card.classList.contains("is-mobile-collapsed");
                mobileCollapseState[cardId] = nextCollapsed;
                persistMobileCollapseState();
                setMobileCardCollapsedState(card, toggleButton, nextCollapsed);
                requestMasonryLayoutBurst();
            });

            card.dataset.mobileCollapseReady = "true";
        };

        const refreshMobileCardCollapsing = () => {
            mobileCollapsibleCardIds.forEach((cardId) => {
                initializeMobileCollapsibleCard(cardId);
                const card = document.getElementById(cardId);
                const toggleButton = card?.querySelector(".mobile-card-collapse-toggle");
                if (!card || !toggleButton) return;

                const shouldCollapse = mobileCollapseQuery.matches ? getMobileCollapseValue(cardId) : false;
                setMobileCardCollapsedState(card, toggleButton, shouldCollapse);
            });

            requestMasonryLayoutBurst();
        };

        refreshMobileCardCollapsing();
        const handleMobileCollapseQueryChange = () => refreshMobileCardCollapsing();
        if (typeof mobileCollapseQuery.addEventListener === "function") {
            mobileCollapseQuery.addEventListener("change", handleMobileCollapseQueryChange);
        } else if (typeof mobileCollapseQuery.addListener === "function") {
            mobileCollapseQuery.addListener(handleMobileCollapseQueryChange);
        }

        const triggerRouteAnimation = () => {
            if (!grid) return;
            grid.classList.remove("is-route-enter");
            void grid.offsetWidth;
            grid.classList.add("is-route-enter");
            clearTimeout(routeAnimationTimer);
            routeAnimationTimer = setTimeout(() => {
                if (grid) grid.classList.remove("is-route-enter");
            }, 280);
        };

        let activeRouteKey = resolveRouteFromPath(window.location.pathname);

        const applyRouteState = (routeKey, options = {}) => {
            const { updateHistory = false, replaceHistory = false } = options;
            const nextRouteKey = normalizeRouteKey(routeKey);
            activeRouteKey = nextRouteKey;

            updateRouteLinkHrefs();
            updateRouteLinkState(nextRouteKey);
            updateRouteSummary(nextRouteKey);
            syncCardVisibilityForRoute(nextRouteKey);
            triggerRouteAnimation();

            requestMasonryLayoutBurst();
            window.dispatchEvent(new Event("resize"));

            if (updateHistory) {
                const targetPath = buildRoutePath(nextRouteKey);
                const currentPath = normalizePath(window.location.pathname);
                if (targetPath !== currentPath) {
                    const historyMethod = replaceHistory ? "replaceState" : "pushState";
                    window.history[historyMethod]({ routeKey: nextRouteKey }, "", targetPath);
                }
            }
        };

        cardToggles.forEach((toggle) => {
            const targetId = toggle.dataset.toggleCard;
            if (!targetId) return;

            if (Object.prototype.hasOwnProperty.call(storedVisibility, targetId)) {
                toggle.checked = Boolean(storedVisibility[targetId]);
            }

            storedVisibility[targetId] = Boolean(toggle.checked);

            toggle.addEventListener("change", () => {
                const isVisible = Boolean(toggle.checked);
                storedVisibility[targetId] = isVisible;
                localStorage.setItem("altkalkis-card-visibility", JSON.stringify(storedVisibility));

                if (isVisible && targetId === "datetimeCard") {
                    if (typeof updateDateTime === "function") updateDateTime();
                    if (typeof drawAnalogClock === "function") drawAnalogClock();
                }

                applyRouteState(activeRouteKey);
            });
        });

        routeLinks.forEach((link) => {
            link.addEventListener("click", (event) => {
                if (event.button !== 0) return;
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

                event.preventDefault();
                const nextRouteKey = normalizeRouteKey(link.dataset.routeLink);
                applyRouteState(nextRouteKey, { updateHistory: true });
                setDrawerOpen(false);
            });
        });

        window.addEventListener("popstate", () => {
            const nextRoute = resolveRouteFromPath(window.location.pathname);
            applyRouteState(nextRoute);
        });

        //masonry: tett layout uten tomme rom
        if (grid && window.Masonry) {
            const cards = Array.from(grid.querySelectorAll(".bordershadow"));
            let resizeTimer;
            let masonry = null;
            let forceInstantLayout = false;
            const mobileLayoutQuery = window.matchMedia("(max-width: 640px)");
            const isWideCard = (card) => card.classList.contains("card--wide") || card.classList.contains("card--wide-auto");

            const clearMasonryInlineStyles = () => {
                grid.style.height = "";
                cards.forEach((card) => {
                    card.style.position = "";
                    card.style.left = "";
                    card.style.top = "";
                });
            };

            const ensureMasonry = () => {
                if (masonry) return masonry;
                masonry = new Masonry(grid, {
                    itemSelector: ".bordershadow",
                    columnWidth: ".grid-sizer",
                    gutter: ".gutter-sizer",
                    percentPosition: true,
                    horizontalOrder: false,
                    transitionDuration: "0.2s",
                });
                return masonry;
            };

            const disableMasonryForMobile = () => {
                if (masonry) {
                    masonry.destroy();
                    masonry = null;
                }
                forceInstantLayout = false;
                clearMasonryBurstTimers();
                clearMasonryInlineStyles();
                scheduleTrendChartRerenderIfNeeded();
            };

            const reorderCardsForPacking = () => {
                if (mobileLayoutQuery.matches || window.matchMedia("(max-width: 1100px)").matches) return;

                const visibleCards = cards.filter((card) => !card.classList.contains("is-hidden"));
                if (visibleCards.length < 4) return;

                const wideCards = [];
                const regularCards = [];
                visibleCards.forEach((card) => {
                    if (isWideCard(card)) {
                        wideCards.push(card);
                    } else {
                        regularCards.push(card);
                    }
                });

                if (!wideCards.length || !regularCards.length) return;

                const ordered = [];
                let wideIndex = 0;
                let regularIndex = 0;

                while (wideIndex < wideCards.length || regularIndex < regularCards.length) {
                    if (wideIndex < wideCards.length) {
                        ordered.push(wideCards[wideIndex]);
                        wideIndex += 1;
                    }

                    if (regularIndex < regularCards.length) {
                        ordered.push(regularCards[regularIndex]);
                        regularIndex += 1;
                    }

                    if (wideIndex >= wideCards.length) {
                        while (regularIndex < regularCards.length) {
                            ordered.push(regularCards[regularIndex]);
                            regularIndex += 1;
                        }
                    }
                }

                const currentOrder = visibleCards.map((card) => card.id).join("|");
                const nextOrder = ordered.map((card) => card.id).join("|");
                if (currentOrder === nextOrder) return;

                ordered.forEach((card) => grid.appendChild(card));
            };

            const requestLayout = () => {
                if (mobileLayoutQuery.matches) {
                    disableMasonryForMobile();
                    return;
                }

                const activeMasonry = ensureMasonry();
                const instantLayout = forceInstantLayout;
                forceInstantLayout = false;
                const previousTransition = activeMasonry.options.transitionDuration;
                if (instantLayout) {
                    activeMasonry.options.transitionDuration = 0;
                }
                reorderCardsForPacking();
                activeMasonry.reloadItems();
                activeMasonry.layout();
                scheduleTrendChartRerenderIfNeeded();
                if (instantLayout) {
                    activeMasonry.options.transitionDuration = previousTransition;
                }
            };

            requestMasonryLayout = (instant = false) => {
                if (instant === true) forceInstantLayout = true;
                window.requestAnimationFrame(requestLayout);
            };

            window.addEventListener("load", requestMasonryLayout);
            window.addEventListener("resize", () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(requestMasonryLayout, 120);
            });

            const handleMobileLayoutChange = () => requestMasonryLayout();
            if (typeof mobileLayoutQuery.addEventListener === "function") {
                mobileLayoutQuery.addEventListener("change", handleMobileLayoutChange);
            } else if (typeof mobileLayoutQuery.addListener === "function") {
                mobileLayoutQuery.addListener(handleMobileLayoutChange);
            }

            const observer = new ResizeObserver(() => {
                if (!mobileLayoutQuery.matches) requestMasonryLayout();
            });
            cards.forEach((card) => observer.observe(card));

            requestMasonryLayout();
        }

        const currentPath = normalizePath(window.location.pathname);
        const canonicalPath = buildRoutePath(activeRouteKey);
        applyRouteState(activeRouteKey);
        if (currentPath !== canonicalPath) {
            window.history.replaceState({ routeKey: activeRouteKey }, "", canonicalPath);
        }

});
