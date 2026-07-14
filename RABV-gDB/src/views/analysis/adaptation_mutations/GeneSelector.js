import { useState } from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

const geneTree = [
  { name: "transmembrane glycoprotein G", nodes: null, parent: null, text: "Glycoprotein" },
  { name: "L protein", nodes: null, parent: null, text: "Large protein / RNA polymerase" },
  { name: "M2 protein", nodes: null, parent: null, text: "Matrix protein" },
  { name: "nucleoprotein N", nodes: null, parent: null, text: "Nucleoprotein" },
  { name: "phosphoprotein M1", nodes: null, parent: null, text: "Phosphoprotein" },
];

function GeneSelector( {onRegionSelect} ) {
  const [selectedGene, setSelectedGene] = useState(geneTree[0].name);

  const handleSelectedGene = (gene) => {
    setSelectedGene(gene)
    onRegionSelect(gene)
  }

  return (
    <div>
        <FormControl>
            {/* <p>Select a gene</p> */}

            <RadioGroup
                value={selectedGene}
                onChange={(e) => handleSelectedGene(e.target.value)}
            >
                {geneTree.map((gene) => (
                <FormControlLabel
                    key={gene.name}
                    value={gene.name}
                    control={<Radio />}
                    label={gene.text}
                    sx={{
                        my: -0.5, // Reduce vertical margin
                    }}
                />
                ))}
            </RadioGroup>
            </FormControl>
    </div>
  );
}

export default GeneSelector;